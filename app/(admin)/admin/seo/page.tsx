import Link from "next/link";
import {
  Search,
  Globe,
  FileText,
  BookOpen,
  FolderOpen,
  Briefcase,
} from "lucide-react";

const seoPages = [
  {
    title: "Home Page SEO",
    key: "home",
    description: "Manage SEO metadata for the public homepage (/).",
    icon: Globe,
  },
  {
    title: "About Page SEO",
    key: "about",
    description: "Manage SEO metadata for the public about page (/about).",
    icon: FileText,
  },
  {
    title: "Contact Page SEO",
    key: "contact",
    description: "Manage SEO metadata for the public contact page (/contact-us.",
    icon: FolderOpen,
  },
  {
    title: "Placements Page SEO",
    key: "placements",
    description: "Manage SEO metadata for the public placements page (/placements).",
    icon: Briefcase,
  },
  {
    title: "Courses Listing SEO",
    key: "courses",
    description: "Manage SEO metadata for the public courses listing page (/courses).",
    icon: BookOpen,
  },
  {
    title: "Blog Listing SEO",
    key: "blogs",
    description:
      "Manage SEO metadata for the public blog listing page (/blogs), not individual posts.",
    icon: Search,
  },
];

export default function SEOManagerPage() {
  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
          SEO Manager
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Website SEO Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Manage SEO metadata for main public pages. Individual course SEO should
          be managed inside each course editor, and individual blog SEO should be
          managed inside each blog editor.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {seoPages.map((page) => {
          const Icon = page.icon;

          return (
            <Link
              key={page.key}
              href={`/admin/seo/${page.key}`}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                <Icon className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-violet-700">
                {page.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {page.description}
              </p>

              <div className="mt-4 text-sm font-medium text-violet-700">
                Edit SEO →
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}