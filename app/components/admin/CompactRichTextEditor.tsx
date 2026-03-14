"use client";

import dynamic from "next/dynamic";
import { type CSSProperties } from "react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  Heading,
  BlockQuote,
  Undo,
  type EditorConfig,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const CKEditor = dynamic(
  async () => {
    const mod = await import("@ckeditor/ckeditor5-react");
    return mod.CKEditor;
  },
  { ssr: false }
);

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
};

const editorConfig: EditorConfig = {
  licenseKey: "GPL",
  plugins: [
    Essentials,
    Paragraph,
    Bold,
    Italic,
    Underline,
    List,
    Link,
    Heading,
    BlockQuote,
    Undo,
  ],
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "underline",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "link",
      "blockQuote",
      "|",
      "undo",
      "redo",
    ],
    shouldNotGroupWhenFull: true,
  },
  placeholder: "Write here...",
};

export default function CompactRichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  minHeight = 120,
}: Props) {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <div
        className="rich-editor overflow-hidden rounded-2xl border border-slate-300 bg-white transition focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-100"
        style={
          {
            ["--editor-min-height"]: `${minHeight}px`,
          } as CSSProperties
        }
      >
        <CKEditor
          editor={ClassicEditor}
          config={{
            ...editorConfig,
            placeholder: placeholder || "Write here...",
          }}
          data={value || ""}
          onChange={(_, editor) => {
            onChange(editor.getData());
          }}
        />
      </div>

      <style jsx global>{`
        .rich-editor .ck.ck-editor {
          width: 100%;
        }

        .rich-editor .ck.ck-toolbar {
          border: 0 !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #f8fafc !important;
          padding: 8px 10px !important;
          flex-wrap: wrap !important;
          gap: 4px !important;
        }

        .rich-editor .ck.ck-editor__main > .ck-editor__editable {
          min-height: var(--editor-min-height);
          max-height: 260px;
          overflow-y: auto;
          padding: 14px 16px !important;
          font-size: 14px;
          line-height: 1.65;
          color: #0f172a;
          border: 0 !important;
          box-shadow: none !important;
          background: #ffffff !important;
        }

        .rich-editor
          .ck.ck-editor__main
          > .ck-editor__editable:not(.ck-focused) {
          border: 0 !important;
        }

        .rich-editor .ck.ck-editor__main > .ck-editor__editable.ck-focused {
          border: 0 !important;
          box-shadow: none !important;
        }

        .rich-editor .ck.ck-button,
        .rich-editor .ck.ck-dropdown__button {
          min-height: 32px !important;
          border-radius: 10px !important;
        }

        .rich-editor .ck-content p {
          margin: 0 0 0.7em;
        }

        .rich-editor .ck-content ul,
        .rich-editor .ck-content ol {
          padding-left: 1.25rem;
        }

        @media (max-width: 768px) {
          .rich-editor .ck.ck-toolbar {
            padding: 6px !important;
          }

          .rich-editor .ck.ck-editor__main > .ck-editor__editable {
            min-height: 110px;
            max-height: 220px;
            padding: 12px 14px !important;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}