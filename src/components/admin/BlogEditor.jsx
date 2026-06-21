"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { uploadImageToCloudinary } from "@/lib/cloudinary/upload-client";
import { cn } from "@/lib/utils/cn";

function ToolbarButton({ active, disabled, onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={cn(
        "flex min-h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium transition",
        active
          ? "bg-secondary-light text-secondary"
          : "text-muted hover:bg-surface-muted hover:text-foreground",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  );
}

export function BlogEditor({ label = "Content", value, onChange, onUploadError }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const isExternalUpdate = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      Image.configure({
        HTMLAttributes: { class: "blog-editor-image" },
      }),
      Placeholder.configure({
        placeholder: "Write your blog post here. Use the toolbar to format text and insert images.",
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "blog-editor-body min-h-[280px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isExternalUpdate.current) return;
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (next !== current) {
      isExternalUpdate.current = true;
      editor.commands.setContent(next, { emitUpdate: false });
      isExternalUpdate.current = false;
    }
  }, [editor, value]);

  const insertImage = useCallback(
    async (file) => {
      if (!editor || !file) return;
      setUploading(true);
      try {
        const url = await uploadImageToCloudinary(file);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } catch (err) {
        onUploadError?.(err.message || "Image upload failed");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [editor, onUploadError]
  );

  function setLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  if (!editor) {
    return (
      <div className="space-y-2">
        {label && <p className="text-sm font-medium text-foreground">{label}</p>}
        <div className="h-72 animate-pulse rounded-xl border border-border bg-surface-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}

      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <div className="flex flex-wrap gap-1 border-b border-border bg-surface-muted p-2">
          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            B
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <span className="italic">I</span>
          </ToolbarButton>
          <ToolbarButton
            title="Heading 2"
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            title="Heading 3"
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </ToolbarButton>
          <ToolbarButton
            title="Bullet list"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            •
          </ToolbarButton>
          <ToolbarButton
            title="Numbered list"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1.
          </ToolbarButton>
          <ToolbarButton
            title="Quote"
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            "
          </ToolbarButton>
          <ToolbarButton title="Add link" active={editor.isActive("link")} onClick={setLink}>
            Link
          </ToolbarButton>
          <ToolbarButton
            title="Insert image"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "…" : "Img"}
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => insertImage(e.target.files?.[0])}
      />

      <p className="text-xs text-muted">
        Tip: place the cursor where you want an image, then click Img to upload and insert inline.
      </p>
    </div>
  );
}
