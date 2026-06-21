"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardListSkeleton } from "@/components/ui/DashboardListSkeleton";
import { useToast } from "@/components/ui/Toast";

export default function AdminBlogPage() {
  const { addToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => d.success && setPosts(d.data))
      .finally(() => setFetching(false));
  }, []);

  async function removePost(id) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      setPosts(posts.filter((p) => p.id !== id));
      addToast("Post deleted", "success");
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Blog & Stories</h1>
        <Link href="/admin/blog/new"><Button className="min-h-11 w-full sm:w-auto">Create post</Button></Link>
      </div>
      <div className="mt-6 space-y-3">
        {fetching ? (
          <DashboardListSkeleton count={8} />
        ) : (
          posts.map((post) => (
          <Card key={post.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{post.title}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                <Badge>{post.postType}</Badge>
                <Badge variant={post.status === "PUBLISHED" ? "success" : "warning"}>{post.status}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/blog/${post.id}`}><Button size="sm" variant="secondary">Edit</Button></Link>
              <Button size="sm" variant="danger" onClick={() => removePost(post.id)}>Delete</Button>
            </div>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
