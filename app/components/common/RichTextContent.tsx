"use client";

type Props = {
  html?: unknown;
  className?: string;
};

function toSafeHtml(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export default function RichTextContent({
  html,
  className = "",
}: Props) {
  const rawHtml = toSafeHtml(html).trim();

  if (!rawHtml) return null;

  return (
    <div
      className={[
        "rich-text-content",
        "prose prose-slate max-w-none",
        "prose-headings:font-bold prose-headings:text-slate-900",
        "prose-p:text-slate-700 prose-p:leading-8",
        "prose-li:text-slate-700 prose-li:leading-8",
        "prose-strong:text-slate-900",
        "prose-a:text-fuchsia-700",
        "prose-ul:my-5 prose-ol:my-5",
        "prose-li:my-1",
        className,
      ].join(" ")}
      dangerouslySetInnerHTML={{ __html: rawHtml }}
    />
  );
}