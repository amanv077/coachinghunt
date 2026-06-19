"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { CityAutocomplete } from "@/components/shared/CityAutocomplete";
import { ExamMultiSelect } from "@/components/shared/ExamMultiSelect";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { ProfileCompletenessBar } from "@/components/coaching/ProfileCompletenessBar";

const emptyFaculty = { name: "", qualification: "", bio: "", photoUrl: "" };

export default function CoachingProfilePage() {
  const { addToast } = useToast();
  const [profileId, setProfileId] = useState("");
  const [completeness, setCompleteness] = useState(null);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    foundedYear: "",
    city: "",
    locality: "",
    category: "",
    phone: "",
    alternatePhone: "",
    email: "",
    website: "",
    mode: "OFFLINE",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    targetExams: [],
    subjects: "",
    facilities: "",
    logoUrl: "",
    coverImageUrl: "",
    galleryImages: [],
    videoUrl: "",
    achievementsText: "",
    facultyProfiles: [],
    listingStatus: "DRAFT",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/coachings/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProfileId(d.data.id);
          setCompleteness(d.data.completeness || null);
          setForm({
            name: d.data.name || "",
            tagline: d.data.tagline || "",
            description: d.data.description || "",
            foundedYear: d.data.foundedYear ? String(d.data.foundedYear) : "",
            city: d.data.city || "",
            locality: d.data.locality || "",
            category: d.data.category || "",
            phone: d.data.phone || "",
            alternatePhone: d.data.alternatePhone || "",
            email: d.data.email || "",
            website: d.data.website || "",
            mode: d.data.mode || "OFFLINE",
            addressLine1: d.data.addressLine1 || "",
            addressLine2: d.data.addressLine2 || "",
            pincode: d.data.pincode || "",
            targetExams: d.data.targetExams || [],
            subjects: d.data.subjects?.join(", ") || "",
            facilities: d.data.facilities?.join(", ") || "",
            logoUrl: d.data.logoUrl || "",
            coverImageUrl: d.data.coverImageUrl || "",
            galleryImages: d.data.galleryImages || [],
            videoUrl: d.data.videoUrl || "",
            achievementsText: d.data.achievementsText || "",
            facultyProfiles: Array.isArray(d.data.facultyProfiles) ? d.data.facultyProfiles : [],
            listingStatus: d.data.listingStatus || "DRAFT",
          });
        }
      });
  }, []);

  function updateFaculty(index, field, value) {
    setForm((prev) => {
      const facultyProfiles = [...prev.facultyProfiles];
      facultyProfiles[index] = { ...facultyProfiles[index], [field]: value };
      return { ...prev, facultyProfiles };
    });
  }

  function addFaculty() {
    setForm((prev) => ({
      ...prev,
      facultyProfiles: [...prev.facultyProfiles, { ...emptyFaculty }],
    }));
  }

  function removeFaculty(index) {
    setForm((prev) => ({
      ...prev,
      facultyProfiles: prev.facultyProfiles.filter((_, i) => i !== index),
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/coachings/${profileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        foundedYear: form.foundedYear ? Number(form.foundedYear) : null,
        city: form.city,
        locality: form.locality,
        category: form.category,
        phone: form.phone,
        alternatePhone: form.alternatePhone || null,
        email: form.email || null,
        website: form.website || null,
        mode: form.mode,
        addressLine1: form.addressLine1 || null,
        addressLine2: form.addressLine2 || null,
        pincode: form.pincode || null,
        targetExams: form.targetExams,
        subjects: form.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        facilities: form.facilities.split(",").map((s) => s.trim()).filter(Boolean),
        logoUrl: form.logoUrl || null,
        coverImageUrl: form.coverImageUrl || null,
        galleryImages: form.galleryImages,
        videoUrl: form.videoUrl || null,
        achievementsText: form.achievementsText || null,
        facultyProfiles: form.facultyProfiles.filter((f) => f.name.trim()),
        listingStatus: form.listingStatus,
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success && data.data?.completeness) {
      setCompleteness(data.data.completeness);
    }
    addToast(data.success ? "Profile saved" : data.message, data.success ? "success" : "error");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Coaching Profile</h1>
      <p className="mt-1 text-sm text-muted">Complete your profile to attract more students.</p>

      {completeness && (
        <div className="mt-4 max-w-2xl">
          <ProfileCompletenessBar completeness={completeness} />
        </div>
      )}

      <Card className="mt-6 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Photos</h2>
            <ImageUpload
              label="Logo"
              value={form.logoUrl}
              onChange={(logoUrl) => setForm({ ...form, logoUrl })}
            />
            <ImageUpload
              label="Cover photo"
              value={form.coverImageUrl}
              onChange={(coverImageUrl) => setForm({ ...form, coverImageUrl })}
            />
            <ImageUpload
              label="Gallery photos"
              value={form.galleryImages}
              onChange={(galleryImages) => setForm({ ...form, galleryImages })}
              multiple
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Basic info</h2>
            <Input label="Institute Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            <Textarea label="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Founded year" type="number" value={form.foundedYear} onChange={(e) => setForm({ ...form, foundedYear: e.target.value })} />
              <Select label="Teaching mode" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                <option value="OFFLINE">Offline</option>
                <option value="ONLINE">Online</option>
                <option value="HYBRID">Hybrid</option>
              </Select>
            </div>
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <ExamMultiSelect label="Target exams" value={form.targetExams} onChange={(targetExams) => setForm({ ...form, targetExams })} />
            <Input label="Subjects (comma separated)" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} />
            <Input label="Facilities (comma separated)" value={form.facilities} onChange={(e) => setForm({ ...form, facilities: e.target.value })} placeholder="AC classrooms, Library, Hostel" />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Contact & location</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <CityAutocomplete label="City" value={form.city} onChange={(city) => setForm({ ...form, city })} />
              <Input label="Locality" value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} />
            </div>
            <Input label="Address line 1" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} />
            <Input label="Address line 2" value={form.addressLine2} onChange={(e) => setForm({ ...form, addressLine2: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <Input label="Alternate phone" type="tel" value={form.alternatePhone} onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })} />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Website" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Results & media</h2>
            <Textarea
              label="Results & achievements"
              rows={3}
              value={form.achievementsText}
              onChange={(e) => setForm({ ...form, achievementsText: e.target.value })}
              placeholder="e.g. 120 JEE qualifiers in 2024, 95% NEET pass rate"
            />
            <Input
              label="Video introduction (YouTube or Vimeo URL)"
              type="url"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-foreground">Faculty</h2>
              <Button type="button" variant="secondary" size="sm" className="min-h-9" onClick={addFaculty}>
                Add faculty
              </Button>
            </div>
            {form.facultyProfiles.length === 0 && (
              <p className="text-sm text-muted">Add teachers to build trust with students.</p>
            )}
            {form.facultyProfiles.map((faculty, index) => (
              <Card key={index} className="space-y-3 !p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Faculty {index + 1}</p>
                  <button type="button" onClick={() => removeFaculty(index)} className="text-sm text-danger">
                    Remove
                  </button>
                </div>
                <Input label="Name" value={faculty.name} onChange={(e) => updateFaculty(index, "name", e.target.value)} />
                <Input label="Qualification" value={faculty.qualification} onChange={(e) => updateFaculty(index, "qualification", e.target.value)} />
                <Textarea label="Bio" rows={2} value={faculty.bio} onChange={(e) => updateFaculty(index, "bio", e.target.value)} />
              </Card>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Listing</h2>
            <Select label="Listing status" value={form.listingStatus} onChange={(e) => setForm({ ...form, listingStatus: e.target.value })}>
              <option value="DRAFT">Draft (hidden from search)</option>
              <option value="ACTIVE">Active (visible in search)</option>
              <option value="PAUSED">Paused</option>
            </Select>
          </section>

          <Button type="submit" loading={loading} className="min-h-11 w-full md:w-auto">
            Save Profile
          </Button>
        </form>
      </Card>
    </div>
  );
}
