"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { RequestDemoModal } from "@/components/shared/RequestDemoModal";

export function RequestDemoButton({
  coachingId,
  courseId,
  coachingName,
  courseTitle,
  size = "sm",
  className,
  variant = "primary",
  label = "Request a demo",
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleClick() {
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user?.role !== "STUDENT") {
      return;
    }
    setOpen(true);
  }

  if (session?.user?.role && session.user.role !== "STUDENT") {
    return null;
  }

  return (
    <>
      <Button size={size} variant={variant} className={className} onClick={handleClick}>
        {label}
      </Button>
      <RequestDemoModal
        open={open}
        onClose={() => setOpen(false)}
        coachingId={coachingId}
        courseId={courseId}
        coachingName={coachingName}
        courseTitle={courseTitle}
      />
    </>
  );
}
