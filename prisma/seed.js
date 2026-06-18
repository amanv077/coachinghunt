import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@coachinghunt.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@coachinghunt.com",
      passwordHash,
      role: "ADMIN",
      phone: "9999999999",
    },
  });

  const coachingUsers = [];
  const coachings = [
    {
      name: "Excel Academy",
      email: "owner@excelacademy.com",
      slug: "excel-academy",
      city: "Delhi",
      locality: "Rohini",
      category: "Engineering Entrance",
      targetExams: ["JEE", "NEET"],
      subjects: ["Physics", "Chemistry", "Math"],
    },
    {
      name: "Bright Minds Institute",
      email: "contact@brightminds.com",
      slug: "bright-minds-institute",
      city: "Noida",
      locality: "Sector 62",
      category: "Medical Entrance",
      targetExams: ["NEET"],
      subjects: ["Biology", "Chemistry", "Physics"],
    },
    {
      name: "Success Coaching Centre",
      email: "info@successcoaching.com",
      slug: "success-coaching-centre",
      city: "Delhi",
      locality: "Dwarka",
      category: "Foundation",
      targetExams: ["JEE", "Boards"],
      subjects: ["Math", "Science"],
    },
  ];

  for (const c of coachings) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        passwordHash,
        role: "COACHING",
        phone: "9876543210",
        coachingProfile: {
          create: {
            name: c.name,
            slug: c.slug,
            tagline: `Top coaching in ${c.locality}`,
            description: `${c.name} offers quality offline coaching for ${c.targetExams.join(", ")}.`,
            city: c.city,
            locality: c.locality,
            category: c.category,
            targetExams: c.targetExams,
            subjects: c.subjects,
            facilities: ["AC Classrooms", "Library", "Doubt Sessions"],
            verificationStatus: "VERIFIED",
            listingStatus: "ACTIVE",
            avgRating: 4.2,
            reviewCount: 12,
          },
        },
      },
      include: { coachingProfile: true },
    });
    coachingUsers.push(user);
  }

  for (const user of coachingUsers) {
    await prisma.coachingBranch.upsert({
      where: { id: `${user.coachingProfile.id}-branch` },
      update: {},
      create: {
        id: `${user.coachingProfile.id}-branch`,
        coachingId: user.coachingProfile.id,
        branchName: "Main Branch",
        city: user.coachingProfile.city,
        locality: user.coachingProfile.locality,
        address: "Main Road",
        isPrimary: true,
      },
    });
  }

  const courseData = [
    { coachingIdx: 0, title: "JEE Advanced Batch", slug: "jee-advanced-batch", targetExam: "JEE", fees: 45000 },
    { coachingIdx: 0, title: "NEET Foundation", slug: "neet-foundation-excel", targetExam: "NEET", fees: 35000 },
    { coachingIdx: 1, title: "NEET Crash Course", slug: "neet-crash-course", targetExam: "NEET", fees: 28000 },
    { coachingIdx: 1, title: "Biology Masterclass", slug: "biology-masterclass", targetExam: "NEET", fees: 15000 },
    { coachingIdx: 2, title: "Class 11 Foundation", slug: "class-11-foundation", targetExam: "JEE", fees: 32000 },
    { coachingIdx: 2, title: "Boards + JEE Combo", slug: "boards-jee-combo", targetExam: "JEE", fees: 40000 },
    { coachingIdx: 0, title: "Weekend JEE Batch", slug: "weekend-jee-batch", targetExam: "JEE", fees: 25000 },
    { coachingIdx: 1, title: "Physics Intensive", slug: "physics-intensive", targetExam: "NEET", fees: 18000 },
  ];

  const courses = [];
  for (const c of courseData) {
    const coaching = coachingUsers[c.coachingIdx].coachingProfile;
    const branch = await prisma.coachingBranch.findFirst({
      where: { coachingId: coaching.id, isPrimary: true },
    });
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        coachingId: coaching.id,
        branchId: branch?.id,
        title: c.title,
        slug: c.slug,
        description: `Comprehensive ${c.targetExam} preparation program.`,
        courseType: "BATCH",
        targetExam: c.targetExam,
        classLevel: "11-12",
        batchSize: 40,
        fees: c.fees,
        durationText: "6 months",
        scheduleSummary: "Mon-Sat, 4 PM - 7 PM",
        status: "ACTIVE",
        isFeatured: c.coachingIdx === 0,
      },
    });
    courses.push(course);
  }

  const now = new Date();
  for (let i = 0; i < 15; i++) {
    const course = courses[i % courses.length];
    const demoDate = new Date(now);
    demoDate.setDate(demoDate.getDate() + i + 3);
    await prisma.demoSlot.create({
      data: {
        courseId: course.id,
        coachingId: course.coachingId,
        topic: `Demo Session ${i + 1}`,
        teacherName: "Expert Faculty",
        demoDate,
        startTime: "16:00",
        endTime: "17:00",
        durationMinutes: 60,
        capacity: 30,
        bookedCount: i < 3 ? 1 : 0,
        venueName: "Main Hall",
        venueAddress: "Campus Address",
        status: "OPEN",
      },
    });
  }

  const students = [];
  for (let i = 1; i <= 5; i++) {
    const student = await prisma.user.upsert({
      where: { email: `student${i}@example.com` },
      update: {},
      create: {
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        passwordHash,
        role: "STUDENT",
        phone: `987654321${i}`,
        studentProfile: {
          create: {
            city: "Delhi",
            classLevel: "12",
            targetExam: i % 2 === 0 ? "NEET" : "JEE",
            preferredSubjects: ["Physics", "Chemistry"],
          },
        },
      },
      include: { studentProfile: true },
    });
    students.push(student);
  }

  const slots = await prisma.demoSlot.findMany({ take: 3 });
  for (let i = 0; i < slots.length; i++) {
    await prisma.booking.create({
      data: {
        studentId: students[i].studentProfile.id,
        demoSlotId: slots[i].id,
        courseId: slots[i].courseId,
        coachingId: slots[i].coachingId,
        bookingCode: `BK-${1000 + i}`,
        status: "CONFIRMED",
        emailStatus: "SENT",
      },
    });
  }

  for (const user of coachingUsers) {
    await prisma.offer.create({
      data: {
        coachingId: user.coachingProfile.id,
        title: "Early Bird Discount",
        description: "Get 10% off on full course enrollment",
        validFrom: new Date(),
        validTill: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate()),
        status: "ACTIVE",
      },
    });
  }

  console.log("Seed completed:", { admin: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
