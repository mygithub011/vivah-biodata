import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";
import { getAllKeywordSlugs } from "@/lib/seo/keywords";
import { getAllBlogSlugs } from "@/lib/content/blog/posts";
import { getAllFaqSlugs } from "@/lib/content/faqs/pages";
import { COLLECTIONS, TEMPLATES } from "@/lib/templates/collections";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Keyword landing pages
  const keywordPages: MetadataRoute.Sitemap = getAllKeywordSlugs().map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Collection pages
  const collectionPages: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${SITE_URL}/collections/${c.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Template pages
  const templatePages: MetadataRoute.Sitemap = TEMPLATES.map((t) => ({
    url: `${SITE_URL}/templates/${t.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog posts
  const blogPages: MetadataRoute.Sitemap = getAllBlogSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // FAQ pages
  const faqPages: MetadataRoute.Sitemap = getAllFaqSlugs().map((slug) => ({
    url: `${SITE_URL}/faqs/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...keywordPages, ...collectionPages, ...templatePages, ...blogPages, ...faqPages];
}
