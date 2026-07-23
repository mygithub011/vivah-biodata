import { SITE_URL } from "./constants";
import { KEYWORD_PAGES } from "./keywords";
import { BLOG_POSTS } from "../content/blog/posts";
import { FAQ_PAGES } from "../content/faqs/pages";

interface InternalLink {
  title: string;
  href: string;
  description?: string;
}

// Get related keyword pages
export function getRelatedKeywordLinks(currentSlug: string): InternalLink[] {
  const current = KEYWORD_PAGES.find((k) => k.slug === currentSlug);
  if (!current) return [];

  const links: InternalLink[] = [];
  for (const slug of current.relatedPages) {
    const page = KEYWORD_PAGES.find((k) => k.slug === slug);
    if (page) {
      links.push({ title: page.h1.split("—")[0].trim(), href: `/${page.slug}`, description: page.description });
    }
  }
  return links;
}

// Get related blog posts for a topic
export function getRelatedBlogLinks(keywords: string[], excludeSlug?: string): InternalLink[] {
  return BLOG_POSTS.filter((post) => post.slug !== excludeSlug)
    .filter((post) => keywords.some((kw) => post.keywords.some((pk) => pk.includes(kw) || kw.includes(pk))))
    .slice(0, 4)
    .map((post) => ({
      title: post.title,
      href: `/blog/${post.slug}`,
      description: post.description,
    }));
}

// Get related FAQ links
export function getRelatedFaqLinks(excludeSlug?: string): InternalLink[] {
  return FAQ_PAGES.filter((faq) => faq.slug !== excludeSlug)
    .slice(0, 4)
    .map((faq) => ({
      title: faq.title,
      href: `/faqs/${faq.slug}`,
    }));
}

// Get template links for internal linking
export function getTemplateLinks(): InternalLink[] {
  return [
    { title: "Elegant Templates", href: "/templates/elegant-template" },
    { title: "Classic Templates", href: "/templates/classic-template" },
    { title: "Minimal Templates", href: "/templates/minimal-template" },
    { title: "Traditional Templates", href: "/templates/traditional-template" },
    { title: "Professional Templates", href: "/templates/professional-template" },
  ];
}

// Build breadcrumb items
export function buildBreadcrumbs(segments: { name: string; path: string }[]): { name: string; url: string }[] {
  return [{ name: "Home", url: SITE_URL }, ...segments.map((s) => ({ name: s.name, url: `${SITE_URL}${s.path}` }))];
}

// Generate CTA link for the tool
export function getCtaLink(): InternalLink {
  return {
    title: "Create Your Biodata Now →",
    href: "/collections",
    description: "Start creating your marriage biodata for free",
  };
}
