import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, TWITTER_HANDLE, LOCALE } from "./constants";

interface PageMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  ogImage?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    keywords = [],
    path,
    ogImage = DEFAULT_OG_IMAGE,
    noindex = false,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
  } = options;

  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const, "max-video-preview": -1 },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: LOCALE,
      type: type === "article" ? "article" : "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },
  };
}

export function generateArticleMetadata(options: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  keywords?: string[];
}): Metadata {
  return generatePageMetadata({
    title: options.title,
    description: options.description,
    path: `/blog/${options.slug}`,
    type: "article",
    publishedTime: options.publishedAt,
    modifiedTime: options.updatedAt,
    authors: options.author ? [options.author] : undefined,
    keywords: options.keywords,
  });
}
