"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import { ExamMultiSelect } from "@/components/shared/ExamMultiSelect";
import { ChangePasswordForm } from "@/components/shared/ChangePasswordForm";

function ProfileSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-40" />
      <Card className="mt-6 max-w-2xl">
        <Skeleton className="h-4 w-56" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProfileField({ label, value, emptyText = "Not set" }) {
  return (
    <div className="py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm text-foreground sm:text-base">
        {value || <span className="text-muted">{emptyText}</span>}
      </p>
    </div>
  );
}

export default function StudentProfilePage() {
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    city: "",
    classLevel: "",
    targetExams: [],
    schoolName: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetch("/api/student/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProfile(d.data);
          setForm({
            city: d.data.city || "",
            classLevel: d.data.classLevel || "",
            targetExams: d.data.targetExams || [],
            schoolName: d.data.schoolName || "",
          });
        } else {
          setFetchError(d.message || "Failed to load profile");
        }
      })
      .catch(() => setFetchError("Failed to load profile"));
  }, []);

  function startEditing() {
    setForm({
      city: profile.city || "",
      classLevel: profile.classLevel || "",
      targetExams: profile.targetExams || [],
      schoolName: profile.schoolName || "",
    });
    setEditing(true);
  }

  function cancelEditing() {
    setForm({
      city: profile.city || "",
      classLevel: profile.classLevel || "",
      targetExams: profile.targetExams || [],
      schoolName: profile.schoolName || "",
    });
    setEditing(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/student/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);

    if (!data.success) {
      addToast(data.message || "Could not update profile", "error");
      return;
    }

    setProfile(data.data);
    setEditing(false);
    addToast("Profile updated", "success");
  }

  if (!profile) {
    if (fetchError) {
      return (
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <Card className="mt-6 border-danger/30 bg-danger/5">
            <p className="text-sm text-danger">{fetchError}</p>
            <Button className="mt-4 min-h-11" onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        </div>
      );
    }
    return <ProfileSkeleton />;
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="mt-1 text-sm text-muted">
            {profile.user?.name} · {profile.user?.email}
          </p>
        </div>
        {!editing && (
          <Button
            type="button"
            variant="secondary"
            className="min-h-11 w-full sm:w-auto"
            onClick={startEditing}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <Card className="mt-6 max-w-2xl">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-5">
            <CityAutocomplete
              label="City"
              value={form.city}
              onChange={(city) => setForm({ ...form, city })}
            />
            <ExamMultiSelect
              label="Exams / courses"
              value={form.targetExams}
              onChange={(targetExams) => setForm({ ...form, targetExams })}
            />
            <Input
              label="Class Level"
              placeholder="e.g. Class 11, Class 12"
              value={form.classLevel}
              onChange={(e) => setForm({ ...form, classLevel: e.target.value })}
            />
            <Input
              label="School Name"
              value={form.schoolName}
              onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
            />
            <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row">
              <Button type="submit" loading={loading} className="min-h-11 w-full sm:w-auto">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="min-h-11 w-full sm:w-auto"
                onClick={cancelEditing}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="divide-y divide-border">
            <ProfileField label="City" value={profile.city} />
            <div className="py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Exams / courses
              </p>
              {profile.targetExams?.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.targetExams.map((exam) => (
                    <Badge key={exam} variant="primary">{exam}</Badge>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-sm text-muted">Not set</p>
              )}
            </div>
            <ProfileField label="Class Level" value={profile.classLevel} />
            <ProfileField label="School Name" value={profile.schoolName} />
          </div>
        )}
      </Card>

      <div className="mt-6 max-w-2xl">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
