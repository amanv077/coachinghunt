"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BookDemoButton } from "@/components/shared/BookDemoButton";
import { ReviewForm } from "@/components/shared/ReviewForm";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const tabs = [
  { id: "about", label: "About" },
  { id: "courses", label: "Courses" },
  { id: "demos", label: "Demos" },
  { id: "reviews", label: "Reviews" },
];

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function LoginGate({ title, description, compact = false }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-secondary/20 bg-secondary-light",
        compact ? "px-4 py-3" : "p-5"
      )}
    >
      <div className="flex items-start gap-3">
        <LockIcon className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted">{description}</p>
          <Link href="/login" className="mt-3 inline-block cursor-pointer">
            <Button size="sm">Login to unlock</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CoachingProfileView({ coaching, session }) {
  const [activeTab, setActiveTab] = useState("about");
  const isLoggedIn = !!session?.user;

  const initials = coaching.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const openDemos = coaching.demoSlots?.filter((s) => s.status === "OPEN") ?? [];
  const courseCount = coaching.courses?.length ?? 0;
  const reviewCount = coaching.reviewCount ?? coaching.reviews?.length ?? 0;

  function scrollToDemos() {
    setActiveTab("demos");
    document.getElementById("coaching-demos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="pb-24 md:pb-8">
      <div className="relative h-48 sm:h-56">
        {coaching.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coaching.coverImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary-hover to-primary-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative -mt-16 sm:-mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold text-white shadow-lg ring-4 ring-white sm:h-24 sm:w-24">
                {coaching.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coaching.logoUrl} alt="" className="h-full w-full rounded-2xl object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{coaching.name}</h1>
                  {coaching.verificationStatus === "VERIFIED" && (
                    <Badge variant="success">Verified</Badge>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted sm:text-base">
                  <svg className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {coaching.locality}, {coaching.city}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm">
              <StarIcon className="h-5 w-5 text-warning" />
              <span className="text-lg font-bold text-foreground">
                {coaching.avgRating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-sm text-muted">({reviewCount} reviews)</span>
            </div>
          </div>

          {coaching.tagline && (
            <p className="mt-4 text-lg text-muted">{coaching.tagline}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {coaching.category && <Badge variant="default">{coaching.category}</Badge>}
            {coaching.mode && <Badge variant="default">{coaching.mode}</Badge>}
            {coaching.targetExams?.map((e) => (
              <Badge key={e} variant="primary">
                {e}
              </Badge>
            ))}
            {coaching.subjects?.map((s) => (
              <Badge key={s} variant="default">
                {s}
              </Badge>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 rounded-xl border border-border bg-white px-5 py-4 shadow-sm">
            <span className="text-sm text-muted">
              <strong className="text-foreground">{courseCount}</strong> course{courseCount !== 1 ? "s" : ""}
            </span>
            <span className="text-border">·</span>
            <span className="text-sm text-muted">
              <strong className="text-foreground">{reviewCount}</strong> review{reviewCount !== 1 ? "s" : ""}
            </span>
            <span className="text-border">·</span>
            <span className="text-sm text-muted">
              <strong className="text-foreground">{openDemos.length}</strong> demo{openDemos.length !== 1 ? "s" : ""} available
            </span>
            {coaching.foundedYear && (
              <>
                <span className="text-border">·</span>
                <span className="text-sm text-muted">
                  Est. <strong className="text-foreground">{coaching.foundedYear}</strong>
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 border-b border-border">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "min-h-11 shrink-0 cursor-pointer border-b-2 px-4 py-2 text-sm font-medium transition",
                  activeTab === tab.id
                    ? "border-secondary text-secondary"
                    : "border-transparent text-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {activeTab === "about" && (
            <div className="max-w-3xl space-y-6">
              {coaching.description ? (
                <p className="leading-relaxed text-muted">{coaching.description}</p>
              ) : (
                <p className="text-muted">No description available yet.</p>
              )}

              {coaching.facilities?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground">Facilities</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {coaching.facilities.map((f) => (
                      <Badge key={f} variant="default">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {!isLoggedIn && (
                <LoginGate
                  title="Contact & location details"
                  description="Login to view phone number, email, full address, and website."
                />
              )}

              {isLoggedIn && (coaching.phone || coaching.email || coaching.addressLine1) && (
                <Card>
                  <h3 className="font-semibold text-foreground">Contact & location</h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    {coaching.phone && (
                      <div><dt className="text-muted">Phone</dt><dd className="font-medium">{coaching.phone}</dd></div>
                    )}
                    {coaching.email && (
                      <div><dt className="text-muted">Email</dt><dd className="font-medium">{coaching.email}</dd></div>
                    )}
                    {coaching.addressLine1 && (
                      <div>
                        <dt className="text-muted">Address</dt>
                        <dd className="font-medium">
                          {coaching.addressLine1}
                          {coaching.addressLine2 && `, ${coaching.addressLine2}`}
                          {coaching.pincode && ` — ${coaching.pincode}`}
                        </dd>
                      </div>
                    )}
                    {coaching.website && (
                      <div>
                        <dt className="text-muted">Website</dt>
                        <dd>
                          <a href={coaching.website} target="_blank" rel="noopener noreferrer" className="font-medium text-secondary hover:underline">
                            {coaching.website}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </Card>
              )}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {coaching.courses?.length > 0 ? (
                coaching.courses.map((course) => (
                  <Card key={course.id} className="h-full">
                    {isLoggedIn ? (
                      <Link href={`/courses/${course.slug}`} className="block cursor-pointer">
                        <h3 className="font-semibold text-foreground">{course.title}</h3>
                        <p className="mt-1 text-sm text-muted">
                          {course.targetExam} · {course.durationText}
                        </p>
                        {course.fees && (
                          <p className="mt-3 text-lg font-bold text-secondary">
                            ₹{course.fees.toLocaleString()}
                          </p>
                        )}
                      </Link>
                    ) : (
                      <>
                        <h3 className="font-semibold text-foreground">{course.title}</h3>
                        <p className="mt-1 text-sm text-muted">
                          {course.targetExam} · {course.durationText}
                        </p>
                        {course.description && (
                          <p className="mt-2 text-sm text-muted">{course.description}</p>
                        )}
                        <LoginGate
                          compact
                          title="Course fees & schedule"
                          description="Login to view fees, batch size, faculty details, and full course page."
                        />
                      </>
                    )}
                  </Card>
                ))
              ) : (
                <p className="text-muted">No courses listed yet.</p>
              )}
            </div>
          )}

          {activeTab === "demos" && (
            <div id="coaching-demos">
              {!isLoggedIn ? (
                <div className="space-y-4">
                  {openDemos.length > 0 ? (
                    <>
                      <p className="text-sm text-muted">
                        {openDemos.length} demo session{openDemos.length !== 1 ? "s" : ""} available — preview below
                      </p>
                      <div className="space-y-3">
                        {openDemos.map((slot) => (
                          <Card key={slot.id}>
                            <p className="font-medium text-foreground">{slot.topic}</p>
                            <p className="mt-1 text-sm text-muted">
                              {new Date(slot.demoDate).toLocaleDateString(undefined, {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                              <LockIcon className="h-3.5 w-3.5" />
                              Time, teacher & venue visible after login
                            </p>
                          </Card>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-muted">No upcoming demo slots. Check back soon.</p>
                  )}
                  <LoginGate
                    title="Book a free demo"
                    description="Sign in to see exact times, teacher details, and reserve your seat instantly."
                  />
                </div>
              ) : openDemos.length > 0 ? (
                <div className="space-y-3">
                  {openDemos.map((slot) => (
                    <Card key={slot.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-foreground">{slot.topic}</p>
                        <p className="mt-1 text-sm text-muted">
                          {new Date(slot.demoDate).toLocaleDateString()} · {slot.startTime}–{slot.endTime}
                          {slot.teacherName && ` · ${slot.teacherName}`}
                        </p>
                      </div>
                      <BookDemoButton demoSlotId={slot.id} disabled={slot.status !== "OPEN"} />
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No upcoming demo slots. Check back soon.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {session?.user?.role === "STUDENT" && (
                <div className="mb-6">
                  <ReviewForm coachingId={coaching.id} />
                </div>
              )}
              {coaching.reviews?.length > 0 ? (
                <div className="space-y-3">
                  {coaching.reviews.map((review) => (
                    <Card key={review.id}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.student?.user?.name}</span>
                        <Badge variant="primary">
                          <StarIcon className="mr-0.5 inline h-3 w-3 text-warning" />
                          {review.rating}
                        </Badge>
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{review.comment}</p>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No reviews yet. Be the first to share your experience.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-white p-4 md:hidden">
        <Button className="min-h-11 w-full cursor-pointer" size="lg" onClick={scrollToDemos}>
          {isLoggedIn ? "Book a Demo" : "View Demo Slots"}
        </Button>
      </div>
    </div>
  );
}
