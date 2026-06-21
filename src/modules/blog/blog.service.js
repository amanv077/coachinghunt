import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/helpers";
import { sanitizeBlogHtml } from "@/lib/utils/html";

export async function listPublishedPosts({ postType, page = 1, limit = 12 } = {}) {
  const where = {
    status: "PUBLISHED",
    ...(postType && { postType }),
  };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function getPostBySlug(slug) {
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      reactions: {
        select: {
          type: true,
        },
      },
    },
  });
  if (!post) return null;

  const likes = post.reactions.filter((r) => r.type === "LIKE").length;
  const dislikes = post.reactions.filter((r) => r.type === "DISLIKE").length;
  const { reactions, _count, ...rest } = post;

  return {
    ...rest,
    likes,
    dislikes,
    commentsCount: _count.comments,
  };
}

export async function listAllPosts() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      reactions: {
        select: {
          type: true,
        },
      },
    },
  });

  return posts.map((post) => {
    const likes = post.reactions.filter((r) => r.type === "LIKE").length;
    const dislikes = post.reactions.filter((r) => r.type === "DISLIKE").length;
    const { reactions, _count, ...rest } = post;
    return {
      ...rest,
      views: post.views,
      likes,
      dislikes,
      commentsCount: _count.comments,
    };
  });
}

export async function getPostById(id) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function createPost(data) {
  const slug = data.slug || slugify(data.title);
  const sanitizedContent = sanitizeBlogHtml(data.content);
  return prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: sanitizedContent,
      coverImageUrl: data.coverImageUrl || null,
      tags: data.tags || [],
      postType: data.postType || "BLOG",
      status: data.status || "DRAFT",
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      authorName: data.authorName || null,
    },
  });
}

export async function updatePost(id, data) {
  const sanitizedContent = data.content ? sanitizeBlogHtml(data.content) : undefined;
  return prisma.blogPost.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.slug && { slug: data.slug }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.content && { content: sanitizedContent }),
      ...(data.coverImageUrl !== undefined && { coverImageUrl: data.coverImageUrl }),
      ...(data.tags && { tags: data.tags }),
      ...(data.postType && { postType: data.postType }),
      ...(data.authorName !== undefined && { authorName: data.authorName }),
      ...(data.status && {
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? new Date() : undefined,
      }),
    },
  });
}

export async function deletePost(id) {
  return prisma.blogPost.delete({ where: { id } });
}

export async function createBlogQuery(data) {
  return prisma.blogQuery.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      blogSlug: data.blogSlug,
      blogTitle: data.blogTitle,
    },
  });
}

export async function listBlogQueries() {
  return prisma.blogQuery.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateBlogQueryStatus(id, status) {
  return prisma.blogQuery.update({
    where: { id },
    data: { status },
  });
}

export async function incrementPostViews(id) {
  return prisma.blogPost.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

export async function getPostReactionState({ blogPostId, userId, ipAddress }) {
  const where = userId
    ? { blogPostId, userId }
    : { blogPostId, ipAddress, userId: null };

  const reaction = await prisma.blogReaction.findFirst({ where });
  return reaction ? reaction.type : null;
}

export async function togglePostReaction({ blogPostId, userId, ipAddress, type }) {
  const where = userId
    ? { blogPostId, userId }
    : { blogPostId, ipAddress, userId: null };

  const existing = await prisma.blogReaction.findFirst({ where });

  if (existing) {
    if (existing.type === type) {
      await prisma.blogReaction.delete({
        where: { id: existing.id },
      });
      return { action: "undone" };
    } else {
      await prisma.blogReaction.update({
        where: { id: existing.id },
        data: { type },
      });
      return { action: "updated" };
    }
  } else {
    await prisma.blogReaction.create({
      data: {
        blogPostId,
        userId: userId || null,
        ipAddress,
        type,
      },
    });
    return { action: "created" };
  }
}

export async function getPostReactionCounts(blogPostId) {
  const reactions = await prisma.blogReaction.findMany({
    where: { blogPostId },
    select: { type: true },
  });

  const likes = reactions.filter((r) => r.type === "LIKE").length;
  const dislikes = reactions.filter((r) => r.type === "DISLIKE").length;

  return { likes, dislikes };
}

export async function createComment({ blogPostId, userId, content }) {
  return prisma.blogComment.create({
    data: {
      blogPostId,
      userId,
      content,
    },
    include: {
      user: {
        select: {
          name: true,
          role: true,
        },
      },
    },
  });
}

export async function listComments(blogPostId) {
  return prisma.blogComment.findMany({
    where: { blogPostId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          role: true,
        },
      },
    },
  });
}

export async function deleteComment(commentId, userId, userRole) {
  const comment = await prisma.blogComment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (userRole !== "ADMIN" && comment.userId !== userId) {
    throw new Error("Unauthorized to delete this comment");
  }

  return prisma.blogComment.delete({
    where: { id: commentId },
  });
}
