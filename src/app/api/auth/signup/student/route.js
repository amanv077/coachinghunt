import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { successResponse, errorResponse } from "@/lib/utils/api-response";
import { rateLimit } from "@/lib/utils/rate-limit";
import {
  generateReferralCode,
  sendEmailVerification,
  recordReferral,
} from "@/modules/auth/verification.service";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms and Privacy Policy" }),
  }),
  referralCode: z.string().optional(),
});

export async function POST(request) {
  const limited = rateLimit(request, "signup-student", 5, 15 * 60 * 1000);
  if (limited) return errorResponse("Too many signup attempts. Try again later.", [], 429);

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(parsed.error.errors[0]?.message || "Validation failed", parsed.error.errors, 422);
    }

    const existing = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return errorResponse("Email already registered", [], 409);
    }

    const phoneInUse = await prisma.user.findFirst({
      where: { phone: parsed.data.phone },
    });
    if (phoneInUse) {
      return errorResponse("This phone number is already registered to another account", [], 409);
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
            targetExams: [],
          },
        },
      },
      include: { studentProfile: true },
    });

    const referralCode = generateReferralCode(user.id);
    await prisma.studentProfile.update({
      where: { id: user.studentProfile.id },
      data: { referralCode },
    });

    if (parsed.data.referralCode) {
      await recordReferral(parsed.data.referralCode, user.studentProfile.id);
    }

    try {
      await sendEmailVerification(user);
    } catch (err) {
      console.error("Verification email failed:", err);
    }

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
