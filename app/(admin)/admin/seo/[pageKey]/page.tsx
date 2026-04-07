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
    description: "Manage metadata for the public contact page (/contact).",
  },
  placements: {
    title: "Edit Placements Page SEO",
    description: "Manage metadata for the public placements page (/placements).",
  },
};

export default async function AdminSEOEditPage({
  params,
}: {
  params: Promise<{ pageKey: string }>;
}) {
  const { pageKey } = await params;

  const meta = pageMetaMap[pageKey] || {
    title: `Edit ${pageKey} SEO`,
    description: "Manage SEO metadata for this public page.",
  };

  return (
    <SEOEditorForm
      pageKey={pageKey}
      pageTitle={meta.title}
      pageDescription={meta.description}
    />
  );
}