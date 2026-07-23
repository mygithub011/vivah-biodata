import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "../constants";

// Organization Schema
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/deities/website-logo.png`,
    description: SITE_DESCRIPTION,
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

// Website Schema
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/collections?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// SoftwareApplication Schema
export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "49",
      priceCurrency: "INR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "10000",
      bestRating: "5",
    },
    description: SITE_DESCRIPTION,
  };
}

// WebPage Schema
export function webPageSchema(options: { title: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.title,
    description: options.description,
    url: options.url,
    isPartOf: { "@type": "WebSite", url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

// FAQPage Schema
export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// BreadcrumbList Schema
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Article Schema
export function articleSchema(options: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: options.title,
    description: options.description,
    url: options.url,
    datePublished: options.publishedAt,
    dateModified: options.updatedAt || options.publishedAt,
    author: {
      "@type": "Organization",
      name: options.author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/deities/website-logo.png` },
    },
    image: options.image || `${SITE_URL}/og-image.png`,
    mainEntityOfPage: { "@type": "WebPage", "@id": options.url },
  };
}

// CollectionPage Schema
export function collectionPageSchema(options: { name: string; description: string; url: string; itemCount: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: options.name,
    description: options.description,
    url: options.url,
    numberOfItems: options.itemCount,
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}
