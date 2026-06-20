"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export function getCoachingInitials(name) {
  return (
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

function BuildingIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 21h19.5M3.75 21V8.25l8.25-4.5 8.25 4.5V21M9 21v-6h6v6"
      />
    </svg>
  );
}

function ImagePlaceholderIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
      />
    </svg>
  );
}

const logoSizes = {
  sm: "h-14 w-14 text-lg",
  md: "h-16 w-16 text-xl",
  lg: "h-16 w-16 text-xl sm:h-20 sm:w-20 sm:text-2xl",
};

const coverGradients = {
  card: "bg-gradient-to-br from-secondary-light to-secondary-muted/40",
  hero: "bg-gradient-to-br from-secondary via-secondary-hover to-primary-dark",
};

const coverIconStyles = {
  card: "h-10 w-10 text-secondary/25",
  hero: "h-12 w-12 text-white/25 sm:h-14 sm:w-14",
};

export function CoachingLogo({ src, name, size = "sm", className }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary font-bold text-white",
        logoSizes[size],
        className
      )}
      aria-hidden={!name}
      aria-label={name ? `${name} logo` : undefined}
    >
      {showPlaceholder ? (
        <>
          <BuildingIcon className="absolute h-[55%] w-[55%] text-white/20" />
          <span className="relative z-1">{getCoachingInitials(name)}</span>
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-full w-full rounded-xl object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function CoachingCoverImage({ src, variant = "card", className }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (showPlaceholder) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          coverGradients[variant],
          className
        )}
        aria-hidden
      >
        <ImagePlaceholderIcon className={coverIconStyles[variant]} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}

export function CoachingGalleryImage({ src, className, onClick }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (showPlaceholder) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-secondary-light",
          className
        )}
        aria-hidden
      >
        <ImagePlaceholderIcon className="h-8 w-8 text-secondary/30" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={cn("h-full w-full object-cover", className)}
      onClick={onClick}
      onError={() => setFailed(true)}
    />
  );
}
