"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { buildShareCaption } from "@/lib/utils/blog";
import { cn } from "@/lib/utils/cn";

function ShareIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function PlatformButton({ label, onClick, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Share on ${label}`}
      className={cn(
        "flex min-h-11 min-w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-white px-3 py-2 text-xs font-medium text-foreground transition hover:border-secondary/40 hover:bg-secondary-light/50",
        className
      )}
    >
      {children}
      <span>{label}</span>
    </button>
  );
}

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 2C6.486 2 2 6.486 2 12c0 1.846.487 3.584 1.341 5.088L2 22l4.936-1.298A9.953 9.953 0 0012 22c5.514 0 10-4.486 10-10S17.514 2 12 2zm0 18.182a8.17 8.17 0 01-4.162-1.136l-.298-.177-2.933.77.783-2.858-.194-.31A8.168 8.168 0 014.818 12c0-4.515 3.667-8.182 8.182-8.182S21.182 7.485 21.182 12 17.515 20.182 12 20.182z" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.602.388 3.635 1.355 2.668 2.322 2.41 3.495 2.352 4.772 2.294 6.052 2.28 6.461 2.28 9.72v4.56c0 3.259.014 3.668.072 4.948.058 1.277.316 2.45 1.283 3.417.967.967 2.14 1.225 3.417 1.283 1.28.058 1.689.072 4.948.072s3.668-.014 4.948-.072c1.277-.058 2.45-.316 3.417-1.283.967-.967 1.225-2.14 1.283-3.417.058-1.28.072-1.689.072-4.948V9.72c0-3.259-.014-3.668-.072-4.948-.058-1.277-.316-2.45-1.283-3.417C21.398.388 20.225.13 18.948.072 17.668.014 17.259 0 14 0h-4zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.062 2.062 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TelegramIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function LinkIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}

export function SharePost({ title, url, excerpt = "", tags = [], imageUrl = "" }) {
  const { addToast } = useToast();
  const [showInstagramPanel, setShowInstagramPanel] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const shareCaption = buildShareCaption({ title, excerpt, url, tags });

  const copyText = useCallback(async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast(message, "success");
      return true;
    } catch {
      addToast("Could not copy to clipboard", "error");
      return false;
    }
  }, [addToast]);

  const openShareWindow = useCallback((shareUrl) => {
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=520");
  }, []);

  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title,
        text: excerpt || title,
        url,
      });
    } catch (err) {
      if (err?.name !== "AbortError") {
        addToast("Share cancelled or unavailable", "error");
      }
    }
  }, [addToast, excerpt, title, url]);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  async function handleInstagramShare() {
    setShowInstagramPanel(true);
    await copyText(shareCaption, "Caption copied — paste it in your Instagram post");
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center gap-2">
        <ShareIcon className="h-5 w-5 text-secondary" />
        <h2 className="text-sm font-semibold text-foreground">Share this article</h2>
      </div>

      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1">
        {canNativeShare && (
          <PlatformButton label="Share" onClick={handleNativeShare}>
            <ShareIcon className="h-5 w-5 text-secondary" />
          </PlatformButton>
        )}

        <PlatformButton
          label="WhatsApp"
          onClick={() => openShareWindow(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`)}
        >
          <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
        </PlatformButton>

        <PlatformButton label="Instagram" onClick={handleInstagramShare}>
          <InstagramIcon className="h-5 w-5 text-[#E4405F]" />
        </PlatformButton>

        <PlatformButton
          label="X"
          onClick={() => openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`)}
        >
          <XIcon className="h-5 w-5 text-foreground" />
        </PlatformButton>

        <PlatformButton
          label="Facebook"
          onClick={() => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)}
        >
          <FacebookIcon className="h-5 w-5 text-[#1877F2]" />
        </PlatformButton>

        <PlatformButton
          label="LinkedIn"
          onClick={() => openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`)}
        >
          <LinkedInIcon className="h-5 w-5 text-[#0A66C2]" />
        </PlatformButton>

        <PlatformButton
          label="Telegram"
          onClick={() => openShareWindow(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`)}
        >
          <TelegramIcon className="h-5 w-5 text-[#26A5E4]" />
        </PlatformButton>

        <PlatformButton label="Copy link" onClick={() => copyText(url, "Link copied to clipboard")}>
          <LinkIcon className="h-5 w-5 text-secondary" />
        </PlatformButton>
      </div>

      {showInstagramPanel && (
        <div className="mt-4 rounded-xl border border-border bg-surface-muted p-4">
          <p className="text-sm font-medium text-foreground">Post to Instagram</p>
          <p className="mt-1 text-xs text-muted">
            Instagram does not allow direct web posting. Copy the caption below, open Instagram, and paste it into a new post or story link sticker.
          </p>

          {imageUrl && (
            <p className="mt-2 text-xs text-muted">
              Tip: download the cover image from this page to use as your post visual.
            </p>
          )}

          <textarea
            readOnly
            value={shareCaption}
            rows={6}
            className="mt-3 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
          />

          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              className="min-h-11 w-full sm:w-auto"
              onClick={() => copyText(shareCaption, "Caption copied for Instagram")}
            >
              Copy caption
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="min-h-11 w-full sm:w-auto"
              onClick={() => window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer")}
            >
              Open Instagram
            </Button>
            {imageUrl && (
              <Button
                type="button"
                variant="secondary"
                className="min-h-11 w-full sm:w-auto"
                onClick={() => window.open(imageUrl, "_blank", "noopener,noreferrer")}
              >
                Open cover image
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
