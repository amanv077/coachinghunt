"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

export default function CoachingCoursesPage() {
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [coachingId, setCoachingId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", targetExam: "", fees: "", durationText: "", scheduleSummary: "", courseType: "BATCH",
  });

  useEffect(() => {
    fetch("/api/coachings/me").then((r) => r.json()).then((d) => {
      if (d.success) {
        setCoachingId(d.data.id);
        fetch(`/api/courses?coachingId=${d.data.id}`).then((r) => r.json()).then((c) => c.success && setCourses(c.data));
      }
    });
  }, []);

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
      addToast("Course created", "success");
    } else {
      addToast(data.message, "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses & Batches</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Course"}</Button>
      </div>

      {showForm && (
        <Card className="mt-6">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Target Exam" value={form.targetExam} onChange={(e) => setForm({ ...form, targetExam: e.target.value })} />
              <Input label="Fees" type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} />
            </div>
            <Input label="Duration" value={form.durationText} onChange={(e) => setForm({ ...form, durationText: e.target.value })} />
            <Input label="Schedule" value={form.scheduleSummary} onChange={(e) => setForm({ ...form, scheduleSummary: e.target.value })} />
            <Select label="Type" value={form.courseType} onChange={(e) => setForm({ ...form, courseType: e.target.value })}>
              <option value="BATCH">Batch</option>
              <option value="COURSE">Course</option>
            </Select>
            <Button type="submit" loading={loading}>Create Course</Button>
          </form>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {courses.map((c) => (
          <Card key={c.id}>
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-muted">{c.targetExam} · ₹{c.fees?.toLocaleString()}</p>
              </div>
              <Badge variant={c.status === "ACTIVE" ? "success" : "default"}>{c.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
