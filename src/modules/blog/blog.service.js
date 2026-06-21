import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/utils/helpers";

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
  return prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export async function listAllPosts() {
  return prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function getPostById(id) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function createPost(data) {
  const slug = data.slug || slugify(data.title);
  return prisma.blogPost.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content,
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
  return prisma.blogPost.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.slug && { slug: data.slug }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.content && { content: data.content }),
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
