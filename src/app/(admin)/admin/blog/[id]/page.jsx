"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function AdminBlogEditPage({ params }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [postId, setPostId] = useState("");
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    postType: "BLOG",
    status: "DRAFT",
    tags: "",
  });

  useEffect(() => {
    params.then(({ id }) => {
      setPostId(id);
      fetch(`/api/admin/blog/${id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setForm({
              title: d.data.title,
              slug: d.data.slug,
              excerpt: d.data.excerpt || "",
              content: d.data.content,
              coverImageUrl: d.data.coverImageUrl || "",
              postType: d.data.postType,
              status: d.data.status,
              tags: d.data.tags?.join(", ") || "",
            });
          }
        });
    });
  }, [params]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/blog/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      addToast("Post updated", "success");
      router.push("/admin/blog");
    } else {
      addToast(data.message, "error");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit post</h1>
      <Card className="mt-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Textarea label="Excerpt" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <Textarea label="Content" rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <Input label="Cover image URL" value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Type" value={form.postType} onChange={(e) => setForm({ ...form, postType: e.target.value })}>
              <option value="BLOG">Blog</option>
              <option value="SUCCESS_STORY">Success story</option>
            </Select>
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </Select>
          </div>
          <Input label="Tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <Button type="submit" loading={loading} className="min-h-11 w-full sm:w-auto">Save changes</Button>
        </form>
      </Card>
    </div>
  );
}
