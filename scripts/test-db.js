import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Connecting to the database...");
    const count = await prisma.blogPost.count();
    console.log(`Total blog posts in DB: ${count}`);

    const blogs = await prisma.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        authorName: true,
        status: true,
      }
    });
    console.log("Blogs list:", JSON.stringify(blogs, null, 2));

    const queriesCount = await prisma.blogQuery.count();
    console.log(`Total blog queries in DB: ${queriesCount}`);
  } catch (error) {
    console.error("Database query failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
