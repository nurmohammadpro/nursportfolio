"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { lowlight } from "lowlight";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Code2,
} from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/app/lib/utils";

// Import common languages for syntax highlighting
import javascript from "lowlight/lib/languages/javascript";
import typescript from "lowlight/lib/languages/typescript";
import python from "lowlight/lib/languages/python";
import css from "lowlight/lib/languages/css";
import html from "lowlight/lib/languages/xml";

lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("python", python);
lowlight.register("css", css);
lowlight.register("html", html);

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  editable?: boolean;
}

export default function TiptapEditor({
  content,
  onChange,
  onImageUpload,
  placeholder = "Write your blog content here...",
  editable = true,
}: TiptapEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Use CodeBlockLowlight instead
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-(--brand) underline hover:text-(--brand-hover)",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-(--code-bg) text-(--code-text) rounded-lg p-4 my-4 overflow-x-auto",
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-lg max-w-none focus:outline-none",
          "prose-headings:text-(--text-main) prose-headings:font-bold",
          "prose-p:text-(--text-main) prose-p:leading-relaxed",
          "prose-a:text-(--brand) prose-a:no-underline hover:prose-a:underline",
          "prose-strong:text-(--text-main) prose-strong:font-semibold",
          "prose-code:text-(--brand) prose-code:bg-(--subtle) prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
          "prose-pre:bg-(--code-bg) prose-pre:text-(--code-text)",
          "prose-blockquote:border-l-4 prose-blockquote:border-(--brand) prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-(--text-subtle)",
          "prose-ul:list-disc prose-ul:pl-6",
          "prose-ol:list-decimal prose-ol:pl-6",
          "min-h-[400px] px-4 py-3"
        ),
      },
    },
  });

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor || !onImageUpload) return;

      setIsUploading(true);
      try {
        const url = await onImageUpload(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [editor, onImageUpload]
  );

  const handleSetLink = useCallback(() => {
    if (!editor) return;

    const url = linkUrl.trim();
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setShowLinkInput(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
    disabled,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={cn(
        "p-2 rounded hover:bg-(--subtle) transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        isActive ? "bg-(--brand) text-white" : "text-(--text-main)"
      )}
    >
      {children}
    </button>
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-(--border-color) rounded-lg overflow-hidden">
      {/* Toolbar */}
      {editable && (
        <div className="border-b border-(--border-color) bg-(--secondary) p-2 flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 pr-2 border-r border-(--border-color)">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 px-2 border-r border-(--border-color)">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive("heading", { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 px-2 border-r border-(--border-color)">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
              title="Ordered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Quote & Code Block */}
          <div className="flex items-center gap-1 px-2 border-r border-(--border-color)">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive("blockquote")}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              title="Code Block"
            >
              <Code2 className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Link */}
          <div className="flex items-center gap-1 px-2 border-r border-(--border-color)">
            {showLinkInput ? (
              <div className="flex items-center gap-1">
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSetLink();
                    if (e.key === "Escape") {
                      setShowLinkInput(false);
                      setLinkUrl("");
                    }
                  }}
                  placeholder="Enter URL..."
                  className="px-2 py-1 text-sm border border-(--border-color) rounded bg-(--primary) text-(--text-main) focus:outline-none focus:ring-2 focus:ring-(--brand)"
                  autoFocus
                />
                <ToolbarButton onClick={handleSetLink} title="Set Link">
                  <LinkIcon className="w-4 h-4" />
                </ToolbarButton>
              </div>
            ) : (
              <ToolbarButton
                onClick={() => {
                  setShowLinkInput(true);
                  setLinkUrl(editor.getAttributes("link").href || "");
                }}
                isActive={editor.isActive("link")}
                title="Link"
              >
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
            )}
          </div>

          {/* Image */}
          {onImageUpload && (
            <div className="flex items-center gap-1 px-2 border-r border-(--border-color)">
              <label
                className={cn(
                  "p-2 rounded hover:bg-(--subtle) transition-colors cursor-pointer",
                  isUploading && "opacity-50 cursor-not-allowed"
                )}
                title="Upload Image"
              >
                <ImageIcon className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Undo/Redo */}
          <div className="flex items-center gap-1 pl-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} className="min-h-[400px]" />
    </div>
  );
}
