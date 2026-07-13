import crypto from "crypto";
import { sendEmail } from "@/lib/email/mailer";
import { prisma } from "@/lib/db/prisma";

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateReferralCode(userId) {
  return `CH${userId.slice(-8).toUpperCase()}`;
}

export async function sendEmailVerification(user) {
  const token = crypto.randomBytes(32).toString("hex");
  const emailVerificationToken = hashToken(token);
  const emailVerificationExpires = new Date(Date.now() + VERIFY_TOKEN_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationToken, emailVerificationExpires },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your CoachingHunt email",
    html: `
      <p>Hi ${user.name},</p>
      <p>Welcome to CoachingHunt! Please verify your email address:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

export async function verifyEmail({ email, token }) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user?.emailVerificationToken || !user.emailVerificationExpires) {
    throw new Error("Invalid or expired verification link");
  }

  if (user.emailVerificationExpires < new Date()) {
    throw new Error("Verification link has expired");
  }

  if (user.emailVerificationToken !== hashToken(token)) {
    throw new Error("Invalid or expired verification link");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerifiedAt: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  return { ok: true };
}

export async function recordReferral(referralCode, newStudentProfileId) {
  if (!referralCode?.trim()) return null;

  const referrer = await prisma.studentProfile.findUnique({
    where: { referralCode: referralCode.trim().toUpperCase() },
  });
  if (!referrer || referrer.id === newStudentProfileId) return null;

  return prisma.referral.create({
    data: {
      referrerId: referrer.id,
      referredUserId: newStudentProfileId,
      referralCode: referralCode.trim().toUpperCase(),
      status: "COMPLETED",
    },
  });
}
