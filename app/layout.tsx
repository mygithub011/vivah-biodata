import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, DEFAULT_OG_IMAGE, TWITTER_HANDLE, LOCALE } from "@/lib/seo/constants";
import { organizationSchema, websiteSchema, softwareApplicationSchema } from "@/lib/seo/schemas";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Create Premium Marriage Biodata in 2 Minutes`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: "marriage biodata, hindu biodata, biodata maker, ShaadiBio, shaadi biodata, wedding biodata PDF, marriage biodata maker, free biodata maker",
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large" as const,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Create Premium Marriage Biodata in 2 Minutes`,
    description: SITE_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Create Premium Marriage Biodata in 2 Minutes`,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
  },
  verification: {
    google: "GOOGLE_SITE_VERIFICATION_TOKEN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data — Organization, Website, SoftwareApplication */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema()) }} />
        {/* Premium Google Fonts for biodata templates */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Cinzel:wght@600;700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,700;1,400&family=Montserrat:wght@700;800&family=Raleway:wght@400;600;700&family=Nunito:wght@400;600;700&family=Yatra+One&family=Hind:wght@400;600&family=IM+Fell+English:ital@1&family=Merriweather:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
        {/* Razorpay Standard Checkout — preloaded for fast payment modal */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className={`${geistSans.variable} antialiased bg-white text-gray-900`}>
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/deities/website-logo.png"
                  alt="ShaadiBio"
                  className="h-16 w-16 object-contain drop-shadow-sm"
                />
                <div className="-space-y-0.5">
                  <span
                    className="leading-none block text-red-700"
                    style={{
                      fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      fontStyle: "italic",
                      letterSpacing: "0.04em",
                    }}
                  >
                    ShaadiBio
                  </span>
                  <span
                    className="block text-red-800/70"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.55rem",
                      fontWeight: 600,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                    }}
                  >
                    Premium Marriage Biodatas
                  </span>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <Link href="/collections" className="text-sm font-medium text-gray-600 hover:text-red-700 transition-colors">
                  Collections
                </Link>
                <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-red-700 transition-colors">
                  Blog
                </Link>
                <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-red-700 transition-colors">
                  FAQ
                </Link>
                <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-red-700 transition-colors">
                  Pricing
                </Link>
                <Link
                  href="/collections"
                  className="bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Create Biodata →
                </Link>
              </div>

              <Link
                href="/collections"
                className="md:hidden bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-xl"
              >
                Create →
              </Link>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/deities/website-logo.png" alt="ShaadiBio" className="h-10 w-10 object-contain" />
                  <span className="font-bold text-white text-lg">ShaadiBio</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Create beautiful, premium marriage biodatas in minutes. Trusted by families across India.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Collections</h4>
                <ul className="space-y-1.5 text-sm">
                  {["👑 Royal", "🌸 Floral", "🛕 Traditional Hindu", "✨ Modern Minimal", "💎 Luxury Gold", "🏛 Heritage"].map((c) => (
                    <li key={c}><Link href="/collections" className="hover:text-amber-400 transition-colors">{c}</Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Resources</h4>
                <ul className="space-y-1.5 text-sm">
                  <li><Link href="/blog" className="hover:text-amber-400 transition-colors">Blog</Link></li>
                  <li><Link href="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
                  <li><Link href="/marriage-biodata-maker" className="hover:text-amber-400 transition-colors">Biodata Maker</Link></li>
                  <li><Link href="/biodata-format-for-marriage" className="hover:text-amber-400 transition-colors">Biodata Formats</Link></li>
                  <li><Link href="/marriage-biodata-pdf" className="hover:text-amber-400 transition-colors">Biodata PDF</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Support</h4>
                <ul className="space-y-1.5 text-sm">
                  {["Contact Us", "Privacy Policy", "Terms of Service", "Refund Policy"].map((item) => (
                    <li key={item}><span className="hover:text-amber-400 transition-colors cursor-pointer">{item}</span></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-500">© 2024 ShaadiBio. All rights reserved. Made with ❤️ in India.</p>
              <p className="text-xs text-gray-500">Secure payments via Razorpay 🔒</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
