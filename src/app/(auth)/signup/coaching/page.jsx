"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { AuthInput } from "@/components/shared/AuthInput";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import { SignupRoleTabs } from "@/components/shared/SignupRoleTabs";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

// Vector Icons
const UserIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const EmailIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const PhoneIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const MapPinIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function CoachingSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    contactPersonName: "",
    coachingName: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    locality: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function validateStep1() {
    if (!form.contactPersonName.trim()) {
      setError("Please enter the contact person's name.");
      return false;
    }
    if (!form.coachingName.trim()) {
      setError("Please enter the coaching or institute name.");
      return false;
    }
    return true;
  }

  function validateStep2() {
    if (!form.email.trim() || !form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  }

  function handleNext() {
    setError("");
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  }

  function handleBack() {
    setError("");
    setStep((prev) => Math.max(1, prev - 1));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.city.trim()) {
      setError("Please select a city.");
      return;
    }
    if (!form.locality.trim()) {
      setError("Please enter your locality.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup/coaching", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.message);
      return;
    }

    router.push("/login?registered=coaching");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <SignupRoleTabs active="coaching" />
      <Card className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 shadow-sm">
        
        {/* Step Indicator */}
        <div className="mb-6 flex items-center justify-between px-2">
          {[1, 2, 3].map((num) => {
            const isCompleted = step > num;
            const isCurrent = step === num;
            return (
              <div key={num} className="flex flex-1 items-center last:flex-none">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 border-2",
                    isCompleted 
                      ? "bg-secondary border-secondary text-white" 
                      : isCurrent 
                        ? "border-secondary text-secondary bg-white ring-4 ring-secondary/15" 
                        : "border-border text-muted bg-white"
                  )}
                >
                  {isCompleted ? "✓" : num}
                </div>
                {num < 3 && (
                  <div
                    className={cn(
                      "h-[2px] flex-1 mx-2 transition-colors duration-300",
                      isCompleted ? "bg-secondary" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Headers */}
        <div className="pb-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Step {step} of 3 — {step === 1 ? "Institute Profile" : step === 2 ? "Account Details" : "Location Info"}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">List your coaching</h1>
          <p className="mt-1.5 text-sm text-muted">
            {step === 1 
              ? "Tell us about your brand name and institute details" 
              : step === 2 
                ? "Set up the administrative credentials for your account" 
                : "Where is your center located? Let local students find you"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <AuthInput
                  label="Contact Person Name"
                  placeholder="Full name of representative"
                  value={form.contactPersonName}
                  onChange={(e) => setForm({ ...form, contactPersonName: e.target.value })}
                  required
                  icon={UserIcon}
                />
                <AuthInput
                  label="Institute Name"
                  placeholder="e.g. Apex Classes"
                  value={form.coachingName}
                  onChange={(e) => setForm({ ...form, coachingName: e.target.value })}
                  required
                  icon={BuildingIcon}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <AuthInput
                  label="Official Email Address"
                  type="email"
                  placeholder="institute@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  icon={EmailIcon}
                />
                <AuthInput
                  label="Contact Phone"
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  icon={PhoneIcon}
                />
                <AuthInput
                  label="Password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  icon={LockIcon}
                  showPasswordToggle={true}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <CityAutocomplete
                  label="City"
                  value={form.city}
                  onChange={(city) => setForm({ ...form, city })}
                  required
                />
                <AuthInput
                  label="Locality / Area"
                  placeholder="e.g. MP Nagar Zone 2"
                  value={form.locality}
                  onChange={(e) => setForm({ ...form, locality: e.target.value })}
                  required
                  icon={MapPinIcon}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-danger/5 border border-danger/10 px-4 py-3 text-sm text-danger flex items-center gap-2"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger/10 text-danger text-xs font-bold">
                !
              </span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            {step > 1 && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                disabled={loading}
                className="flex-1 rounded-xl py-2.5 font-semibold text-sm"
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 rounded-xl py-2.5 font-semibold text-sm"
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                loading={loading}
                className="flex-1 rounded-xl py-2.5 font-semibold text-sm shadow-xs"
              >
                {loading ? "Registering…" : "Register Institute"}
              </Button>
            )}
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already listed?{" "}
          <Link href="/login" className="font-semibold text-secondary hover:text-secondary-hover hover:underline transition-colors">
            Login
          </Link>
        </p>
      </Card>
    </motion.div>
  );
}

