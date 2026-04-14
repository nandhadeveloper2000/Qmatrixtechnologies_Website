import { notFound } from "next/navigation";
import SEOEditorForm from "@/app/components/admin/SEOEditorForm";

const pageMetaMap: Record<string, { title: string; description: string }> = {
  home: {
    title: "Edit Home Page SEO",
    description: "Manage metadata for the public homepage (/).",
  },
  about: {
    title: "Edit About Page SEO",
    description: "Manage metadata for the public about page (/about).",
  },
  contact: {
    title: "Edit Contact Page SEO",
    description: "Manage metadata for the public contact page (/contact-us).",
  },
  placements: {
    title: "Edit Placements Page SEO",
    description: "Manage metadata for the public placements page (/placements).",
  },
  courses: {
    title: "Edit Courses Listing SEO",
    description: "Manage metadata for the public /courses listing page.",
  },
  blogs: {
    title: "Edit Blog Listing SEO",
    description:
      "Manage metadata for the public /blogs page. Individual blog post SEO is managed inside each blog editor.",
  },
};

const allowedPageKeys = Object.keys(pageMetaMap);

type AdminSEOEditPageProps = {
  params: Promise<{
    pageKey: string;
  }>;
};

export function generateStaticParams() {
  return allowedPageKeys.map((pageKey) => ({
    pageKey,
  }));
}

export default async function AdminSEOEditPage({
  params,
}: AdminSEOEditPageProps) {
  const { pageKey } = await params;

  if (!allowedPageKeys.includes(pageKey)) {
    notFound();
  }

  const meta = pageMetaMap[pageKey];

  return (
    <SEOEditorForm
      pageKey={pageKey}
      pageTitle={meta.title}
      pageDescription={meta.description}
    />
  );
}