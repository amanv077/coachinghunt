"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import { ExamMultiSelect } from "@/components/shared/ExamMultiSelect";
import { useToast } from "@/components/ui/Toast";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [city, setCity] = useState("");
  const [targetExams, setTargetExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    setError("");

    if (!city.trim()) {
      setError("Please select your city");
      return;
    }
    if (targetExams.length === 0) {
      setError("Please add at least one exam or course");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/student/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: city.trim(), targetExams }),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      setError(data.message || "Could not save profile");
      addToast(data.message || "Could not save profile", "error");
      return;
    }

    addToast("Profile saved! Finding coachings for you…", "success");
    router.push("/student/dashboard");
  }

  function handleSkip() {
    router.push("/student/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
          Step 2 of 2 — Personalise your search
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">Complete your profile</h1>
        <p className="mt-2 text-sm text-muted">
          Tell us your city and exams so we can show coachings that match your goals.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          <CityAutocomplete
            label="Your city"
            value={city}
            onChange={setCity}
            required
            placeholder="e.g. Mumbai, Indore, Delhi"
          />

          <ExamMultiSelect
            label="Exams / courses you're preparing for"
            value={targetExams}
            onChange={setTargetExams}
            placeholder="e.g. JEE, NEET, Boards"
          />

          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="min-h-11 w-full sm:flex-1" loading={loading}>
              Save &amp; Continue
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 w-full sm:w-auto"
              onClick={handleSkip}
            >
              Skip for now
            </Button>
          </div>
        </form>
      </Card>

      <p className="mt-4 text-center text-xs text-muted">
        You can update these anytime from{" "}
        <Link href="/student/profile" className="font-medium text-secondary hover:underline">
          My Profile
        </Link>
      </p>
    </div>
  );
}
