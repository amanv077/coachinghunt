"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BookDemoButton } from "@/components/shared/BookDemoButton";
import { RequestDemoButton } from "@/components/shared/RequestDemoButton";
import { ReviewForm } from "@/components/shared/ReviewForm";
import { SaveCoachingButton } from "@/components/shared/SaveCoachingButton";
import { CompareCoachingButton } from "@/components/shared/CompareCoachingButton";
import { QASection } from "@/components/shared/QASection";
import { PromoCodeChip } from "@/components/shared/PromoCodeChip";
import { Button } from "@/components/ui/Button";
import {
  CoachingCoverImage,
  CoachingGalleryImage,
  CoachingLogo,
} from "@/components/shared/CoachingMedia";
import { cn } from "@/lib/utils/cn";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "courses", label: "Courses" },
  { id: "demos", label: "Demos" },
  { id: "offers", label: "Offers" },
  { id: "qa", label: "Q&A" },
  { id: "reviews", label: "Reviews" },
];

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function formatDemoDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDemoDay(date) {
  return new Date(date).toLocaleDateString(undefined, { day: "numeric" });
}

function formatDemoMonth(date) {
  return new Date(date).toLocaleDateString(undefined, { month: "short" });
}

function SectionHeading({ id, title, subtitle }) {
  return (
    <div id={id} className="scroll-mt-28">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

function StatCard({ label, value, highlight = false }) {
  return (
    <div className="rounded-xl border border-border bg-white px-4 py-3 text-center shadow-sm">
      <p className={cn("text-xl font-bold", highlight ? "text-success" : "text-foreground")}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </div>
  );
}

function SignInPrompt({ title, description, compact = false }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-secondary/15 bg-secondary-light/60",
        compact ? "px-4 py-3" : "p-4"
      )}
    >
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/login">
          <Button size="sm" className="min-h-9">Sign in</Button>
        </Link>
        <Link href="/signup">
          <Button size="sm" variant="secondary" className="min-h-9">Create free account</Button>
        </Link>
      </div>
    </div>
  );
}

function getVideoEmbedUrl(url) {
  if (!url) return null;
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

function GalleryStrip({ images }) {
  const [active, setActive] = useState(null);
  if (!images?.length) return null;

  return (
    <>
      <div className="mt-6 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {images.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => setActive(url)}
            className="h-24 w-32 shrink-0 snap-start overflow-hidden rounded-xl border border-border"
          >
            <CoachingGalleryImage src={url} />
          </button>
        ))}
      </div>
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
          role="presentation"
        >
          <CoachingGalleryImage
            src={active}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </>
  );
}

export function CoachingProfileView({ coaching, session, isSaved = false, studentBookings = [], canReview = false, offers = [] }) {
  const [activeSection, setActiveSection] = useState("overview");
  const isLoggedIn = !!session?.user;
  const isStudent = session?.user?.role === "STUDENT";

  const openDemos = coaching.demoSlots?.filter((s) => s.status === "OPEN") ?? [];
  const courseCount = coaching.courses?.length ?? 0;
  const reviewCount = coaching.reviewCount ?? coaching.reviews?.length ?? 0;
  const bookedSlotIds = new Set(studentBookings.map((b) => b.demoSlotId));
  const facultyProfiles = Array.isArray(coaching.facultyProfiles) ? coaching.facultyProfiles : [];
  const videoEmbedUrl = getVideoEmbedUrl(coaching.videoUrl);

  function scrollToSection(sectionId) {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="pb-24 md:pb-12">
      {/* Cover */}
      <div className="relative h-40 sm:h-52">
        <CoachingCoverImage src={coaching.coverImageUrl} variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute left-0 right-0 top-0">
          <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
            <Link
              href="/search"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-foreground shadow-sm backdrop-blur transition hover:bg-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to search
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero card */}
        <div className="relative -mt-14 sm:-mt-16">
          <Card className="overflow-hidden p-0 shadow-md">
            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <CoachingLogo
                    src={coaching.logoUrl}
                    name={coaching.name}
                    size="lg"
                    className="shadow-md ring-4 ring-white"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-bold text-foreground sm:text-2xl lg:text-3xl">
                        {coaching.name}
                      </h1>
                      {coaching.verificationStatus === "VERIFIED" && (
                        <Badge variant="success">Verified</Badge>
                      )}
                      {coaching.isFeatured && (
                        <Badge variant="warning">Featured</Badge>
                      )}
                    </div>
                    {isStudent && (
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <SaveCoachingButton coachingId={coaching.id} initialSaved={isSaved} />
                        <CompareCoachingButton coaching={coaching} className="sm:max-w-xs" />
                      </div>
                    )}
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                      <MapPinIcon className="h-4 w-4 shrink-0 text-secondary" />
                      {[coaching.locality, coaching.city].filter(Boolean).join(", ")}
                    </p>
                    {coaching.tagline && (
                      <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                        {coaching.tagline}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {coaching.category && <Badge variant="default">{coaching.category}</Badge>}
                      {coaching.mode && <Badge variant="default">{coaching.mode}</Badge>}
                      {coaching.targetExams?.map((exam) => (
                        <Badge key={exam} variant="primary">{exam}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3 rounded-xl bg-secondary-light px-4 py-3">
                  <StarIcon className="h-6 w-6 text-warning" />
                  <div>
                    <p className="text-2xl font-bold leading-none text-foreground">
                      {coaching.avgRating?.toFixed(1) || "0.0"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{reviewCount} reviews</p>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Courses" value={courseCount} />
                <StatCard
                  label="Open demos"
                  value={openDemos.length}
                  highlight={openDemos.length > 0}
                />
                <StatCard label="Reviews" value={reviewCount} />
                {coaching.foundedYear ? (
                  <StatCard label="Established" value={coaching.foundedYear} />
                ) : (
                  <StatCard label="Subjects" value={coaching.subjects?.length || "—"} />
                )}
              </div>

              {/* Desktop primary CTA */}
              <div className="mt-5 hidden gap-3 md:flex">
                {openDemos.length > 0 ? (
                  <Button size="lg" className="min-h-11" onClick={() => scrollToSection("demos")}>
                    Book free demo
                  </Button>
                ) : isLoggedIn && isStudent ? (
                  <RequestDemoButton
                    coachingId={coaching.id}
                    coachingName={coaching.name}
                    size="lg"
                    className="min-h-11"
                    label="Request a demo"
                  />
                ) : (
                  <Button size="lg" variant="secondary" className="min-h-11" onClick={() => scrollToSection("courses")}>
                    View courses
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="secondary"
                  className="min-h-11"
                  onClick={() => scrollToSection("overview")}
                >
                  Read more
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <GalleryStrip images={coaching.galleryImages} />

        {/* Section nav */}
        <div className="sticky top-0 z-30 -mx-4 mt-6 border-b border-border bg-white/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "min-h-11 shrink-0 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition",
                  activeSection === section.id
                    ? "bg-secondary-light text-secondary"
                    : "text-muted hover:bg-secondary-light/50 hover:text-foreground"
                )}
              >
                {section.label}
                {section.id === "demos" && openDemos.length > 0 && (
                  <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-success px-1 text-[10px] font-bold text-white">
                    {openDemos.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main content + sidebar */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="space-y-10 lg:col-span-2">
            {/* Overview */}
            <section className="space-y-5">
              <SectionHeading
                id="overview"
                title="About this coaching"
                subtitle="What they teach and what you get"
              />

              {coaching.description ? (
                <p className="text-sm leading-relaxed text-muted sm:text-base">
                  {coaching.description}
                </p>
              ) : (
                <p className="text-sm text-muted">No description available yet.</p>
              )}

              {coaching.achievementsText && (
                <div className="rounded-xl border border-success/20 bg-success/5 p-4">
                  <h3 className="text-sm font-semibold text-foreground">Results & achievements</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{coaching.achievementsText}</p>
                </div>
              )}

              {videoEmbedUrl && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Video introduction</h3>
                  <div className="mt-3 aspect-video overflow-hidden rounded-xl border border-border">
                    <iframe
                      src={videoEmbedUrl}
                      title={`${coaching.name} introduction`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {facultyProfiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Our faculty</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {facultyProfiles.map((faculty, index) => (
                      <Card key={`${faculty.name}-${index}`} className="!p-4">
                        <p className="font-semibold text-foreground">{faculty.name}</p>
                        {faculty.qualification && (
                          <p className="mt-1 text-xs font-medium text-secondary">{faculty.qualification}</p>
                        )}
                        {faculty.bio && (
                          <p className="mt-2 text-sm text-muted">{faculty.bio}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {coaching.branches?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Branches</h3>
                  <div className="mt-3 space-y-2">
                    {coaching.branches.map((branch) => (
                      <div key={branch.id} className="rounded-lg border border-border bg-white px-4 py-3 text-sm">
                        <p className="font-medium text-foreground">{branch.branchName}</p>
                        <p className="mt-1 text-muted">
                          {[branch.locality, branch.city].filter(Boolean).join(", ") || branch.address || "Location not listed"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {coaching.subjects?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Subjects taught</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {coaching.subjects.map((subject) => (
                      <Badge key={subject} variant="default">{subject}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {coaching.facilities?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Facilities</h3>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {coaching.facilities.map((facility) => (
                      <li
                        key={facility}
                        className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-xs text-success">
                          ✓
                        </span>
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!isLoggedIn && (
                <SignInPrompt
                  title="Want contact details?"
                  description="Sign in to see phone, email, full address, and website."
                />
              )}

              {isLoggedIn && (coaching.phone || coaching.email || coaching.addressLine1) && (
                <Card>
                  <h3 className="font-semibold text-foreground">Contact & location</h3>
                  <dl className="mt-3 space-y-3 text-sm">
                    {coaching.phone && (
                      <div className="flex gap-3">
                        <dt className="w-16 shrink-0 text-muted">Phone</dt>
                        <dd className="font-medium">
                          <a href={`tel:${coaching.phone}`} className="text-secondary hover:underline">
                            {coaching.phone}
                          </a>
                        </dd>
                      </div>
                    )}
                    {coaching.email && (
                      <div className="flex gap-3">
                        <dt className="w-16 shrink-0 text-muted">Email</dt>
                        <dd className="font-medium">
                          <a href={`mailto:${coaching.email}`} className="text-secondary hover:underline">
                            {coaching.email}
                          </a>
                        </dd>
                      </div>
                    )}
                    {coaching.addressLine1 && (
                      <div className="flex gap-3">
                        <dt className="w-16 shrink-0 text-muted">Address</dt>
                        <dd className="font-medium">
                          {coaching.addressLine1}
                          {coaching.addressLine2 && `, ${coaching.addressLine2}`}
                          {coaching.pincode && ` — ${coaching.pincode}`}
                        </dd>
                      </div>
                    )}
                    {coaching.website && (
                      <div className="flex gap-3">
                        <dt className="w-16 shrink-0 text-muted">Website</dt>
                        <dd>
                          <a
                            href={coaching.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-secondary hover:underline"
                          >
                            Visit website
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </Card>
              )}
            </section>

            {/* Courses */}
            <section className="space-y-4">
              <SectionHeading
                id="courses"
                title="Courses & batches"
                subtitle={
                  courseCount > 0
                    ? `${courseCount} active course${courseCount !== 1 ? "s" : ""} offered`
                    : "No courses listed yet"
                }
              />

              {coaching.courses?.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {coaching.courses.map((course) => (
                    <Card key={course.id} className="flex h-full flex-col">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{course.title}</h3>
                        <p className="mt-1 text-sm text-muted">
                          {course.targetExams?.join(", ") || course.targetExam}
                          {course.durationText && ` · ${course.durationText}`}
                        </p>
                        {course.description && (
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                            {course.description}
                          </p>
                        )}
                      </div>
                      {isLoggedIn ? (
                        <div className="mt-4 border-t border-border pt-4">
                          {course.fees && (
                            <p className="text-lg font-bold text-secondary">
                              ₹{course.fees.toLocaleString()}
                            </p>
                          )}
                          <Link href={`/courses/${course.slug}`} className="mt-2 inline-block">
                            <Button size="sm" variant="secondary" className="min-h-9">
                              View course details
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="mt-4 border-t border-border pt-3">
                          <p className="text-xs text-muted">Fees & schedule available after sign in</p>
                          <Link href="/login" className="mt-2 inline-block">
                            <Button size="sm" variant="ghost" className="min-h-9 px-0 text-secondary">
                              Sign in to see fees →
                            </Button>
                          </Link>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center">
                  <p className="text-sm text-muted">This coaching hasn&apos;t listed courses yet.</p>
                  <Button
                    variant="secondary"
                    className="mt-3 min-h-11"
                    onClick={() => scrollToSection("demos")}
                  >
                    Check demo sessions instead
                  </Button>
                </Card>
              )}
            </section>

            {/* Demos */}
            <section className="space-y-4">
              <SectionHeading
                id="demos"
                title="Free demo sessions"
                subtitle={
                  openDemos.length > 0
                    ? "Attend a demo before you decide — seats are limited"
                    : "No upcoming demos right now"
                }
              />

              {openDemos.length > 0 ? (
                <div className="space-y-3">
                  {openDemos.map((slot) => (
                    <Card
                      key={slot.id}
                      className="flex flex-col gap-4 p-0 overflow-hidden sm:flex-row sm:items-stretch"
                    >
                      <div className="flex shrink-0 flex-col items-center justify-center bg-secondary-light px-5 py-4 sm:w-24">
                        <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
                          {formatDemoMonth(slot.demoDate)}
                        </span>
                        <span className="text-2xl font-bold text-foreground">
                          {formatDemoDay(slot.demoDate)}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col justify-center px-4 py-4 sm:px-0 sm:pr-4">
                        <p className="font-semibold text-foreground">{slot.topic}</p>
                        <p className="mt-1 text-sm text-muted">{formatDemoDate(slot.demoDate)}</p>
                        {isLoggedIn ? (
                          slot.startTime && (
                            <p className="mt-1 text-sm text-muted">
                              {slot.startTime}–{slot.endTime}
                              {slot.teacherName && ` · ${slot.teacherName}`}
                            </p>
                          )
                        ) : (
                          <p className="mt-1 text-xs text-muted">
                            Exact time & teacher shown after sign in
                          </p>
                        )}
                      </div>
                      {isLoggedIn && (
                        <div className="mt-3 flex shrink-0 items-center px-4 pb-4 sm:px-4 sm:pb-0 sm:flex-col sm:items-end sm:gap-2 lg:flex-row lg:items-center">
                          {slot.joiningLink && bookedSlotIds.has(slot.id) && (
                            <a href={slot.joiningLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                              <Button size="sm" variant="secondary" className="min-h-9 w-full">Join demo</Button>
                            </a>
                          )}
                          <BookDemoButton demoSlotId={slot.id} disabled={slot.status !== "OPEN"} />
                        </div>
                      )}
                    </Card>
                  ))}
                  {!isLoggedIn && (
                    <SignInPrompt
                      title="Ready to book?"
                      description="Create a free student account to reserve your demo seat and get instant confirmation."
                    />
                  )}
                </div>
              ) : (
                <Card className="space-y-4 text-center">
                  <p className="text-sm text-muted">
                    No demo slots scheduled right now. Request a date that works for you and the coaching will confirm.
                  </p>
                  {isLoggedIn && isStudent ? (
                    <RequestDemoButton
                      coachingId={coaching.id}
                      coachingName={coaching.name}
                      size="md"
                      className="min-h-11 w-full sm:w-auto"
                      label="Request a demo"
                    />
                  ) : !isLoggedIn ? (
                    <SignInPrompt
                      title="Want to request a demo?"
                      description="Sign in to ask for a demo on your preferred date."
                      compact
                    />
                  ) : null}
                  {courseCount > 0 && (
                    <Button
                      variant="secondary"
                      className="min-h-11 w-full sm:w-auto"
                      onClick={() => scrollToSection("courses")}
                    >
                      View courses
                    </Button>
                  )}
                </Card>
              )}
            </section>

            {/* Offers */}
            {offers.length > 0 && (
              <section className="space-y-4">
                <SectionHeading id="offers" title="Offers & discounts" subtitle="Limited-time deals from this institute" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {offers.map((offer) => (
                    <Card key={offer.id}>
                      <p className="font-semibold text-foreground">{offer.title}</p>
                      {offer.description && <p className="mt-1 text-sm text-muted">{offer.description}</p>}
                      <p className="mt-2 text-xs text-muted">
                        Valid till {new Date(offer.validTill).toLocaleDateString()}
                      </p>
                      <PromoCodeChip code={offer.promoCode} />
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Q&A */}
            <section className="space-y-4">
              <SectionHeading id="qa" title="Questions & answers" subtitle="Ask the coaching directly" />
              <QASection coachingId={coaching.id} isLoggedIn={isLoggedIn} isStudent={isStudent} />
            </section>

            {/* Reviews */}
            <section className="space-y-4">
              <SectionHeading
                id="reviews"
                title="Student reviews"
                subtitle={
                  reviewCount > 0
                    ? `Rated ${coaching.avgRating?.toFixed(1) || "0.0"} out of 5`
                    : "No reviews yet"
                }
              />

              {isStudent && canReview && (
                <ReviewForm coachingId={coaching.id} />
              )}
              {isStudent && !canReview && (
                <Card className="text-sm text-muted">
                  Book and attend a demo to leave a verified review.
                </Card>
              )}

              {coaching.reviews?.length > 0 ? (
                <div className="space-y-3">
                  {coaching.reviews.map((review) => (
                    <Card key={review.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {review.student?.user?.name || "Student"}
                        </span>
                        <Badge variant="primary">
                          <StarIcon className="mr-0.5 inline h-3 w-3 text-warning" />
                          {review.rating}/5
                        </Badge>
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{review.comment}</p>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="text-center">
                  <p className="text-sm text-muted">
                    No reviews yet. Book a demo and share your experience.
                  </p>
                </Card>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              <Card className="border-secondary/20 bg-secondary-light/30">
                <h3 className="font-semibold text-foreground">
                  {openDemos.length > 0 ? "Book a free demo" : "Interested?"}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {openDemos.length > 0
                    ? `${openDemos.length} demo session${openDemos.length !== 1 ? "s" : ""} available. Try a class before you enroll.`
                    : "Browse courses or check back for upcoming demo sessions."}
                </p>
                {openDemos.length > 0 ? (
                  <Button className="mt-4 min-h-11 w-full" onClick={() => scrollToSection("demos")}>
                    View demo slots
                  </Button>
                ) : isLoggedIn && isStudent ? (
                  <RequestDemoButton
                    coachingId={coaching.id}
                    coachingName={coaching.name}
                    className="mt-4 min-h-11 w-full"
                    size="md"
                    label="Request a demo"
                  />
                ) : (
                  <Button
                    variant="secondary"
                    className="mt-4 min-h-11 w-full"
                    onClick={() => scrollToSection("courses")}
                  >
                    View courses
                  </Button>
                )}
                {!isLoggedIn && (
                  <p className="mt-3 text-center text-xs text-muted">
                    Free to sign up · No payment needed for demos
                  </p>
                )}
              </Card>

              <Card>
                <h3 className="text-sm font-semibold text-foreground">At a glance</h3>
                <dl className="mt-3 space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Location</dt>
                    <dd className="text-right font-medium text-foreground">
                      {[coaching.locality, coaching.city].filter(Boolean).join(", ") || "—"}
                    </dd>
                  </div>
                  {coaching.category && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Category</dt>
                      <dd className="text-right font-medium text-foreground">{coaching.category}</dd>
                    </div>
                  )}
                  {coaching.mode && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Mode</dt>
                      <dd className="text-right font-medium text-foreground">{coaching.mode}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Exams</dt>
                    <dd className="text-right font-medium text-foreground">
                      {coaching.targetExams?.join(", ") || "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Rating</dt>
                    <dd className="flex items-center gap-1 font-medium text-foreground">
                      <StarIcon className="h-3.5 w-3.5 text-warning" />
                      {coaching.avgRating?.toFixed(1) || "0.0"} ({reviewCount})
                    </dd>
                  </div>
                  {coaching.avgResponseHours != null && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Response time</dt>
                      <dd className="font-medium text-secondary">~{coaching.avgResponseHours}h</dd>
                    </div>
                  )}
                </dl>
              </Card>

              {!isLoggedIn && (
                <SignInPrompt
                  compact
                  title="Join CoachingHunt"
                  description="Save coachings, book demos, and get offers — free for students."
                />
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-[60] border-t border-border bg-white p-4 pb-safe md:hidden">
        {openDemos.length > 0 ? (
          <Button className="min-h-11 w-full" size="lg" onClick={() => scrollToSection("demos")}>
            {isLoggedIn ? "Book free demo" : "View demo slots"}
          </Button>
        ) : isLoggedIn && isStudent ? (
          <RequestDemoButton
            coachingId={coaching.id}
            coachingName={coaching.name}
            className="min-h-11 w-full"
            size="lg"
            label="Request a demo"
          />
        ) : (
          <Button
            className="min-h-11 w-full"
            size="lg"
            variant="secondary"
            onClick={() => scrollToSection("courses")}
          >
            View courses
          </Button>
        )}
      </div>
    </div>
  );
}
