"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export function ChangePasswordForm() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      addToast("New passwords do not match", "error");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      addToast("Password updated", "success");
    } else {
      addToast(data.message, "error");
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold">Change password</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <Input
          label="Current password"
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          required
        />
        <Input
          label="New password"
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          required
        />
        <Input
          label="Confirm new password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          required
        />
        <Button type="submit" loading={loading} className="min-h-11 w-full md:w-auto">
          Update password
        </Button>
      </form>
    </Card>
  );
}
