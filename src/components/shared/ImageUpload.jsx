"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export function ImageUpload({
  label,
  value,
  onChange,
  multiple = false,
  className,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const images = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];

  async function uploadFile(file) {
    const sigRes = await fetch("/api/upload/signature", { method: "POST" });
    const sigData = await sigRes.json();
    if (!sigData.success) throw new Error(sigData.message || "Upload failed");

    const { timestamp, folder, signature, cloudName, apiKey } = sigData.data;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.secure_url) throw new Error("Upload failed");
    return uploadData.secure_url;
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError("");

    try {
      if (multiple) {
        const urls = [];
        for (const file of files) {
          urls.push(await uploadFile(file));
        }
        onChange([...(Array.isArray(value) ? value : []), ...urls]);
      } else {
        const url = await uploadFile(files[0]);
        onChange(url);
      }
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(url) {
    if (multiple) {
      onChange((Array.isArray(value) ? value : []).filter((item) => item !== url));
    } else {
      onChange("");
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}

      {images.length > 0 && (
        <div className={cn("flex flex-wrap gap-3", !multiple && "max-w-xs")}>
          {images.map((url) => (
            <div key={url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className={cn(
                  "rounded-xl border border-border object-cover",
                  multiple ? "h-24 w-24" : "h-32 w-full"
                )}
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-danger text-xs font-bold text-white"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={handleFiles}
        />
        <Button
          type="button"
          variant="secondary"
          className="min-h-11"
          loading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {multiple ? "Add photos" : value ? "Change image" : "Upload image"}
        </Button>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
