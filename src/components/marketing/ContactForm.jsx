"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function ContactForm() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setForm({ name: "", email: "", message: "" });
      addToast("We'll get back to you within 24 hours.", "success");
    }, 600);
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-foreground">Send us a message</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Textarea
          label="Message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <Button type="submit" className="min-h-11 w-full" loading={loading}>
          Send Message
        </Button>
      </form>
    </Card>
  );
}
