"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";
import { ExamMultiSelect } from "@/components/shared/ExamMultiSelect";

const COURSE_TEMPLATES = {
  JEE: [
    { title: "JEE Main 1-Year Prep", description: "Comprehensive preparation program for JEE Main.", durationText: "1 Year", scheduleSummary: "Mon-Fri, 4 PM - 7 PM", fees: "45000", courseType: "COURSE" },
    { title: "JEE Advanced Target Batch", description: "Advanced problem solving and test series for JEE Advanced aspirants.", durationText: "1 Year", scheduleSummary: "Mon-Sat, 3 PM - 7 PM", fees: "55000", courseType: "BATCH" },
    { title: "JEE 3-Month Crash Course", description: "Intensive revision and mock tests for quick improvement.", durationText: "3 Months", scheduleSummary: "Daily, 2 PM - 6 PM", fees: "20000", courseType: "BATCH" },
  ],
  NEET: [
    { title: "NEET 1-Year Droppers Batch", description: "Dedicated batch for repeaters to maximize score in NEET.", durationText: "1 Year", scheduleSummary: "Mon-Sat, 9 AM - 2 PM", fees: "55000", courseType: "BATCH" },
    { title: "NEET Crash Course", description: "Quick revision, formulas, and mock exams for NEET.", durationText: "3 Months", scheduleSummary: "Daily, 3 PM - 7 PM", fees: "22000", courseType: "BATCH" },
    { title: "NEET Biology Masterclass", description: "In-depth biology prep focusing on NCERT and diagrams.", durationText: "6 Months", scheduleSummary: "Tue-Thu-Sat, 4 PM - 6 PM", fees: "15000", courseType: "COURSE" },
  ],
  Boards: [
    { title: "Class 10 Board Accelerator", description: "Science, Math, and English prep for Class 10 CBSE/State Board.", durationText: "9 Months", scheduleSummary: "Mon-Wed-Fri, 5 PM - 7 PM", fees: "15000", courseType: "COURSE" },
    { title: "Class 12 Boards Special", description: "Physics, Chemistry, and Math/Bio boards preparation.", durationText: "9 Months", scheduleSummary: "Tue-Thu-Sat, 4 PM - 7 PM", fees: "20000", courseType: "COURSE" },
  ],
  Foundation: [
    { title: "Class 8-9 Foundation Course", description: "Building strong science and math fundamentals for future competitive exams.", durationText: "1 Year", scheduleSummary: "Mon-Wed-Fri, 4 PM - 6 PM", fees: "25000", courseType: "COURSE" },
    { title: "Junior Olympiad Batch", description: "Advanced mathematics and science training for Olympiad and NTSE.", durationText: "6 Months", scheduleSummary: "Weekends, 10 AM - 1 PM", fees: "12000", courseType: "BATCH" },
  ],
};

export default function CoachingCoursesPage() {
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [coachingId, setCoachingId] = useState("");
  const [coachingProfile, setCoachingProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Suggested templates selection states
  const [selectedTemplates, setSelectedTemplates] = useState({});
  const [templateFees, setTemplateFees] = useState({});
  const [bulkLoading, setBulkLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    targetExams: [],
    fees: "",
    durationText: "",
    scheduleSummary: "",
    courseType: "BATCH",
  });

  useEffect(() => {
    fetch("/api/coachings/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setCoachingId(d.data.id);
          setCoachingProfile(d.data);
          return fetch(`/api/courses?coachingId=${d.data.id}`)
            .then((r) => r.json())
            .then((c) => c.success && setCourses(c.data));
        }
      })
      .finally(() => setFetching(false));
  }, []);

  const getSuggestions = () => {
    if (!coachingProfile?.targetExams?.length) return [];
    const suggestions = [];
    coachingProfile.targetExams.forEach((exam) => {
      const key = Object.keys(COURSE_TEMPLATES).find((k) =>
        exam.toLowerCase().includes(k.toLowerCase())
      );
      if (key && COURSE_TEMPLATES[key]) {
        COURSE_TEMPLATES[key].forEach((t) => {
          if (!suggestions.some((s) => s.title === t.title)) {
            suggestions.push({ ...t, targetExams: [exam] });
          }
        });
      }
    });

    if (suggestions.length === 0) {
      suggestions.push(
        { title: "Standard Batch", description: "General coaching batch.", durationText: "6 months", scheduleSummary: "Mon-Fri", fees: "15000", courseType: "BATCH", targetExams: coachingProfile.targetExams.slice(0, 1) },
        { title: "Premium Course", description: "Comprehensive coaching course.", durationText: "1 year", scheduleSummary: "Mon-Sat", fees: "30000", courseType: "COURSE", targetExams: coachingProfile.targetExams.slice(0, 1) }
      );
    }
    return suggestions;
  };

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, fees: Number(form.fees), status: "ACTIVE" }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setCourses([data.data, ...courses]);
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        targetExams: [],
        fees: "",
        durationText: "",
        scheduleSummary: "",
        courseType: "BATCH",
      });
      addToast("Course created successfully", "success");
    } else {
      addToast(data.message, "error");
    }
  }

  async function handleBulkAdd() {
    const selected = getSuggestions().filter((s) => selectedTemplates[s.title]);
    if (selected.length === 0) return;

    setBulkLoading(true);
    let successCount = 0;
    const addedCourses = [];

    for (const t of selected) {
      const feesVal = templateFees[t.title] !== undefined ? templateFees[t.title] : t.fees;
      try {
        const res = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: t.title,
            description: t.description,
            targetExams: t.targetExams,
            durationText: t.durationText,
            scheduleSummary: t.scheduleSummary,
            courseType: t.courseType,
            fees: Number(feesVal),
            status: "ACTIVE",
          }),
        });
        const data = await res.json();
        if (data.success) {
          addedCourses.push(data.data);
          successCount++;
        }
      } catch (err) {
        console.error("Bulk add error:", err);
      }
    }

    setBulkLoading(false);
    if (successCount > 0) {
      setCourses((prev) => [...addedCourses, ...prev]);
      addToast(`Successfully added ${successCount} courses!`, "success");
      setSelectedTemplates({});
      setTemplateFees({});
      setShowForm(false);
    } else {
      addToast("Failed to add selected courses", "error");
    }
  }

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses & Batches</h1>
          <p className="text-sm text-muted mt-1">Manage the programs and schedules offered by your coaching institute.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Course"}
        </Button>
      </div>

      {showForm && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Manual Form (Col-span 2) */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-foreground">Create Course Manually</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  label="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. JEE Main 1-Year Intensive"
                />
                <Textarea
                  label="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Provide details about the curriculum, study materials, or targets..."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <ExamMultiSelect
                      label="Target Exams"
                      value={form.targetExams || []}
                      onChange={(targetExams) => setForm({ ...form, targetExams })}
                      placeholder="Type target exam name..."
                    />
                  </div>
                  <Input
                    label="Fees (INR)"
                    type="number"
                    value={form.fees}
                    onChange={(e) => setForm({ ...form, fees: e.target.value })}
                    placeholder="e.g. 45000"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Duration"
                    value={form.durationText}
                    onChange={(e) => setForm({ ...form, durationText: e.target.value })}
                    placeholder="e.g. 1 Year, 6 Months"
                  />
                  <Input
                    label="Schedule"
                    value={form.scheduleSummary}
                    onChange={(e) => setForm({ ...form, scheduleSummary: e.target.value })}
                    placeholder="e.g. Mon-Fri, 4 PM - 7 PM"
                  />
                </div>
                <Select
                  label="Type"
                  value={form.courseType}
                  onChange={(e) => setForm({ ...form, courseType: e.target.value })}
                >
                  <option value="BATCH">Batch</option>
                  <option value="COURSE">Course</option>
                </Select>
                <div className="pt-2">
                  <Button type="submit" loading={loading} className="w-full sm:w-auto">
                    Create Course
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Suggestions Panel (Col-span 1) */}
          <div>
            <Card className="p-6 border-secondary/20 bg-secondary-light/20 shadow-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-lg">💡</span>
                <h2 className="text-lg font-bold text-foreground">Suggested Templates</h2>
              </div>
              <p className="text-xs text-muted mb-4">
                Quickly add standard courses matching your target exams.
              </p>

              {getSuggestions().length === 0 ? (
                <p className="text-sm text-muted">No suggestions available. Complete your coaching profile first.</p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {getSuggestions().map((t) => {
                      const isSelected = !!selectedTemplates[t.title];
                      const currentFee = templateFees[t.title] !== undefined ? templateFees[t.title] : t.fees;
                      return (
                        <div key={t.title} className="p-3 rounded-lg border border-border bg-white hover:border-secondary/40 transition">
                          <label className="flex items-start gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => setSelectedTemplates({ ...selectedTemplates, [t.title]: e.target.checked })}
                              className="mt-1 h-4 w-4 rounded border-border text-secondary focus:ring-secondary/20"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{t.title}</p>
                              <p className="text-xs text-muted leading-relaxed line-clamp-2 mt-0.5">{t.description}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                <Badge variant="secondary" className="text-[10px] px-1 py-0">{t.courseType}</Badge>
                                <Badge variant="primary" className="text-[10px] px-1 py-0">{t.targetExams[0]}</Badge>
                                <span className="text-[10px] text-muted ml-1">{t.durationText}</span>
                              </div>
                            </div>
                          </label>
                          {isSelected && (
                            <div className="mt-3 pt-2.5 border-t border-dashed border-border flex items-center justify-between gap-3">
                              <span className="text-xs text-muted shrink-0">Edit Fees:</span>
                              <div className="relative flex-1 max-w-[120px]">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">₹</span>
                                <input
                                  type="number"
                                  value={currentFee}
                                  onChange={(e) => setTemplateFees({ ...templateFees, [t.title]: e.target.value })}
                                  className="w-full text-right pr-2.5 pl-5 py-1 text-xs rounded border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    onClick={handleBulkAdd}
                    loading={bulkLoading}
                    disabled={Object.values(selectedTemplates).filter(Boolean).length === 0}
                    className="w-full min-h-11"
                  >
                    Add Selected ({Object.values(selectedTemplates).filter(Boolean).length})
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {fetching ? (
          <DashboardListSkeleton count={5} />
        ) : courses.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-2">
            <p className="text-sm text-muted">No courses or batches added yet.</p>
            <p className="text-xs text-muted mt-1">Click "Add Course" above to create one manually or use suggestions.</p>
          </Card>
        ) : (
          courses.map((c) => (
            <Card key={c.id} className="p-5 hover:border-secondary/35 transition shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground text-lg">{c.title}</p>
                    <Badge variant={c.status === "ACTIVE" ? "success" : "default"}>{c.status}</Badge>
                    <Badge variant="secondary">{c.courseType}</Badge>
                  </div>
                  {c.description && <p className="text-sm text-muted leading-relaxed line-clamp-2 max-w-2xl">{c.description}</p>}
                  <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
                    {c.targetExams?.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <strong className="text-foreground">Exams:</strong>
                        <span className="flex flex-wrap gap-1">
                          {c.targetExams.map((exam) => (
                            <Badge key={exam} variant="primary" className="text-[10px] py-0 px-1.5">{exam}</Badge>
                          ))}
                        </span>
                      </span>
                    )}
                    {c.durationText && (
                      <span>
                        <strong className="text-foreground">Duration:</strong> {c.durationText}
                      </span>
                    )}
                    {c.scheduleSummary && (
                      <span>
                        <strong className="text-foreground">Schedule:</strong> {c.scheduleSummary}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between sm:flex-col sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <p className="text-2xl font-extrabold text-secondary">
                    ₹{c.fees != null ? c.fees.toLocaleString() : "0"}
                  </p>
                  <Badge variant="outline" className="text-xs">{c.courseType === "BATCH" ? "Batch Mode" : "Self-paced / Regular"}</Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
