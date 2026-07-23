// Site-wide SEO constants
export const SITE_NAME = "ShaadiBio";
export const SITE_URL = "https://shaadibio.com";
export const SITE_DESCRIPTION =
  "Create beautiful, professionally designed marriage biodata in minutes. 50+ premium templates across 8 curated collections. Download HD PDF instantly.";
export const SITE_TAGLINE = "Premium Marriage Biodata Maker";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
export const TWITTER_HANDLE = "@shaadibio";
export const LOCALE = "en_IN";

export const SUPPORTED_LOCALES = ["en", "hi", "te", "ta", "mr", "gu", "bn", "kn"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
