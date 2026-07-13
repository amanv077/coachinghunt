"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

const emptyForm = {
  courseId: "",
  topic: "",
  teacherName: "",
  demoDate: "",
  startTime: "16:00",
  endTime: "17:00",
  durationMinutes: 60,
  capacity: 30,
  venueName: "",
  venueAddress: "",
  joiningLink: "",
};

export default function CoachingDemoSlotsPage() {
  const { addToast } = useToast();
  const [slots, setSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/coachings/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          return Promise.all([
            fetch(`/api/courses?coachingId=${d.data.id}&includeAll=true`)
              .then((r) => r.json())
              .then((c) => c.success && setCourses(c.data.filter((course) => course.status === "ACTIVE"))),
            fetch(`/api/demo-slots?coachingId=${d.data.id}&includePast=true`)
              .then((r) => r.json())
              .then((s) => s.success && setSlots(s.data)),
          ]);
        }
      })
      .finally(() => setFetching(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(editingId ? `/api/demo-slots/${editingId}` : "/api/demo-slots", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      if (editingId) {
        setSlots(slots.map((s) => (s.id === editingId ? data.data : s)));
        setEditingId(null);
      } else {
        setSlots([data.data, ...slots]);
      }
      setShowForm(false);
      setForm(emptyForm);
      addToast(editingId ? "Demo slot updated" : "Demo slot created", "success");
    } else {
      addToast(data.message, "error");
    }
  }

  function startEdit(slot) {
    setEditingId(slot.id);
    setShowForm(true);
    setForm({
      courseId: slot.courseId,
      topic: slot.topic,
      teacherName: slot.teacherName,
      demoDate: slot.demoDate ? new Date(slot.demoDate).toISOString().slice(0, 10) : "",
      startTime: slot.startTime,
      endTime: slot.endTime,
      durationMinutes: slot.durationMinutes,
      capacity: slot.capacity,
      venueName: slot.venueName || "",
      venueAddress: slot.venueAddress || "",
      joiningLink: slot.joiningLink || "",
    });
  }

  async function cancelSlot(id) {
    if (!confirm("Cancel this demo slot?")) return;
    const res = await fetch(`/api/demo-slots/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    const data = await res.json();
    if (data.success) {
      setSlots(slots.map((s) => (s.id === id ? data.data : s)));
      addToast("Demo slot cancelled", "success");
    } else {
      addToast(data.message, "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Demo Slots</h1>
        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); }}>
          {showForm ? "Cancel" : "Add Slot"}
        </Button>
      </div>

      {showForm && (
        <Card className="mt-6">
          <h2 className="mb-4 text-lg font-semibold">{editingId ? "Edit slot" : "Create slot"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select label="Course" value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} required>
              <option value="">Select course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </Select>
            <Input label="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
            <Input label="Teacher Name" value={form.teacherName} onChange={(e) => setForm({ ...form, teacherName: e.target.value })} required />
            <Input label="Date" type="date" value={form.demoDate} onChange={(e) => setForm({ ...form, demoDate: e.target.value })} required />
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Start" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
              <Input label="End" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
              <Input label="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            </div>
            <Input label="Venue" value={form.venueName} onChange={(e) => setForm({ ...form, venueName: e.target.value })} />
            <Input label="Joining link (Meet/Zoom)" type="url" value={form.joiningLink} onChange={(e) => setForm({ ...form, joiningLink: e.target.value })} placeholder="https://meet.google.com/..." />
            <Button type="submit" loading={loading} className="min-h-11">
              {editingId ? "Save changes" : "Create Slot"}
            </Button>
          </form>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {fetching ? (
          <DashboardListSkeleton count={5} />
        ) : (
          slots.map((s) => (
            <Card key={s.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-medium">{s.topic}</p>
                  <p className="text-sm text-muted">{s.course?.title} · {new Date(s.demoDate).toLocaleDateString()}</p>
                  <p className="text-sm text-muted">{s.startTime}–{s.endTime} · {s.bookedCount}/{s.capacity} booked</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={s.status === "OPEN" ? "success" : s.status === "CANCELLED" ? "danger" : "default"}>{s.status}</Badge>
                  {s.status !== "CANCELLED" && (
                    <>
                      <Button type="button" variant="secondary" size="sm" className="min-h-10" onClick={() => startEdit(s)}>Edit</Button>
                      <Button type="button" variant="secondary" size="sm" className="min-h-10" onClick={() => cancelSlot(s.id)}>Cancel</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
