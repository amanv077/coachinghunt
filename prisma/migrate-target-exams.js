import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting raw SQL targetExam migration...");

  const count = await prisma.$executeRawUnsafe(
    `UPDATE "Course" SET "targetExams" = ARRAY["targetExam"] WHERE "targetExam" IS NOT NULL AND ("targetExams" IS NULL OR cardinality("targetExams") = 0)`
  );

  console.log(`Migration completed. Updated ${count} courses.`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
