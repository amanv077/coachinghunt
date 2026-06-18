import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/utils/api-response";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  city: z.string().min(2),
  targetExam: z.string().min(2),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return errorResponse("Validation failed", parsed.error.errors, 422);
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return errorResponse("Email already registered", [], 409);
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        passwordHash,
        role: "STUDENT",
        studentProfile: {
          create: {
            city: parsed.data.city,
            targetExam: parsed.data.targetExam,
          },
        },
      },
      include: { studentProfile: true },
    });

    return successResponse(
      { id: user.id, email: user.email, role: user.role },
      "Student account created",
      201
    );
  } catch (error) {
    console.error(error);
    return errorResponse("Something went wrong", [], 500);
  }
}
