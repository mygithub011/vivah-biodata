import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/blog/*", "/faq", "/faqs/*", "/templates/*", "/collections"],
        disallow: ["/api/*", "/create/*", "/download/*", "/print-preview/*", "/admin/*", "/dashboard/*"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
