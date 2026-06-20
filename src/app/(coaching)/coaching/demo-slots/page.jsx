"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

export default function CoachingDemoSlotsPage() {
  const { addToast } = useToast();
  const [slots, setSlots] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    courseId: "", topic: "", teacherName: "", demoDate: "", startTime: "16:00", endTime: "17:00", durationMinutes: 60, capacity: 30, venueName: "", venueAddress: "", joiningLink: "",
  });

  useEffect(() => {
    fetch("/api/coachings/me").then((r) => r.json()).then((d) => {
      if (d.success) {
        fetch(`/api/courses?coachingId=${d.data.id}`).then((r) => r.json()).then((c) => c.success && setCourses(c.data));
        fetch(`/api/demo-slots?coachingId=${d.data.id}&includePast=true`).then((r) => r.json()).then((s) => s.success && setSlots(s.data));
      }
    });
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/demo-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setSlots([data.data, ...slots]);
      setShowForm(false);
      addToast("Demo slot created", "success");
    } else {
      addToast(data.message, "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Demo Slots</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Slot"}</Button>
      </div>

      {showForm && (
        <Card className="mt-6">
          <form onSubmit={handleCreate} className="space-y-4">
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
            <Button type="submit" loading={loading}>Create Slot</Button>
          </form>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        {slots.map((s) => (
          <Card key={s.id}>
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{s.topic}</p>
                <p className="text-sm text-muted">{s.course?.title} · {new Date(s.demoDate).toLocaleDateString()}</p>
                <p className="text-sm text-muted">{s.bookedCount}/{s.capacity} booked</p>
              </div>
              <Badge variant={s.status === "OPEN" ? "success" : "default"}>{s.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
