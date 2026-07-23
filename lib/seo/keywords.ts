import { SITE_URL } from "./constants";

export interface KeywordConfig {
  slug: string;
  title: string;
  description: string;
  h1: string;
  keywords: string[];
  contentBlocks: {
    introduction: string;
    benefits: string[];
    features: string[];
    whoIsItFor: string[];
    usage: string;
  };
  faqs: { question: string; answer: string }[];
  relatedPages: string[];
}

export const KEYWORD_PAGES: KeywordConfig[] = [
  {
    slug: "marriage-biodata-maker",
    title: "Marriage Biodata Maker — Create Professional Biodata Online | ShaadiBio",
    description:
      "Create a stunning marriage biodata online in minutes with ShaadiBio's free biodata maker. 50+ premium templates, HD PDF download. No signup required.",
    h1: "Marriage Biodata Maker — Create Your Perfect Biodata Online",
    keywords: ["marriage biodata maker", "biodata maker online", "create marriage biodata", "biodata generator"],
    contentBlocks: {
      introduction:
        "ShaadiBio is India's most trusted marriage biodata maker. Create a beautifully designed biodata in just 3 minutes — choose from 50+ premium templates across Royal, Floral, Traditional, Modern, Luxury, and Heritage collections.",
      benefits: [
        "50+ professionally designed templates",
        "HD PDF download without watermark",
        "No signup or account needed",
        "Fill once, preview unlimited",
        "Multiple collections for every taste",
        "Mobile-friendly biodata creation",
      ],
      features: [
        "Instant PDF generation",
        "Premium typography and layouts",
        "Photo upload support",
        "Multi-language support",
        "Secure payment via Razorpay",
        "Share-ready format",
      ],
      whoIsItFor: [
        "Families looking for a professional marriage biodata",
        "Brides and grooms creating their own biodata",
        "Parents preparing biodata for matrimonial purposes",
        "Anyone seeking a modern, elegant biodata format",
      ],
      usage:
        "Simply choose a template from our collections, fill in your details using our guided form, preview your biodata, and download the HD PDF. The entire process takes less than 3 minutes.",
    },
    faqs: [
      { question: "Is ShaadiBio free to use?", answer: "Yes! You can create and preview your biodata for free. HD PDF download without watermark costs just ₹49." },
      { question: "Do I need to create an account?", answer: "No signup required. Start creating your biodata immediately." },
      { question: "What formats are available?", answer: "Your biodata is generated as a high-quality PDF that's perfect for printing or sharing digitally." },
      { question: "Can I edit my biodata after creating it?", answer: "Yes, you can modify your details and regenerate the PDF as many times as you like." },
    ],
    relatedPages: ["free-marriage-biodata-maker", "professional-marriage-biodata", "biodata-format-for-marriage"],
  },
  {
    slug: "free-marriage-biodata-maker",
    title: "Free Marriage Biodata Maker — Create Biodata Online Free | ShaadiBio",
    description:
      "Create your marriage biodata for free with ShaadiBio. Preview unlimited templates, no signup needed. Premium HD download available for just ₹49.",
    h1: "Free Marriage Biodata Maker — No Signup, No Hassle",
    keywords: ["free marriage biodata maker", "free biodata maker", "create biodata free", "marriage biodata free online"],
    contentBlocks: {
      introduction:
        "Looking for a free marriage biodata maker? ShaadiBio lets you create and preview your biodata completely free. Choose from 50+ templates, fill your details, and see your biodata come to life — all without paying anything.",
      benefits: [
        "100% free to create and preview",
        "No hidden charges for biodata creation",
        "Premium templates available free to preview",
        "No signup or registration required",
        "Unlimited previews and edits",
        "Pay only ₹49 for HD download",
      ],
      features: [
        "All 50+ templates accessible",
        "Full form with all biodata fields",
        "Real-time preview",
        "Photo upload included",
        "Professional formatting",
        "Print-ready output",
      ],
      whoIsItFor: [
        "Budget-conscious families",
        "Students and young professionals",
        "Anyone wanting to try before buying",
        "Families exploring biodata formats",
      ],
      usage:
        "Browse our free template gallery, select your preferred design, fill in your information using our intuitive form, and preview your biodata. When satisfied, download the HD PDF for just ₹49.",
    },
    faqs: [
      { question: "Is creating a biodata really free?", answer: "Absolutely! Creating and previewing your biodata is 100% free. You only pay ₹49 for the HD PDF download without watermark." },
      { question: "What's the difference between free and paid?", answer: "Free gives you full access to create and preview. Paid (₹49) gives you a high-resolution PDF without watermark for printing and sharing." },
      { question: "Are there any hidden charges?", answer: "No hidden charges. Preview is free, HD download is ₹49. That's it." },
    ],
    relatedPages: ["marriage-biodata-maker", "simple-marriage-biodata", "marriage-biodata-pdf"],
  },
  {
    slug: "simple-marriage-biodata",
    title: "Simple Marriage Biodata — Clean & Elegant Format | ShaadiBio",
    description:
      "Create a simple yet elegant marriage biodata with clean design and professional formatting. Minimal templates that make a strong impression.",
    h1: "Simple Marriage Biodata — Elegant Simplicity That Speaks Volumes",
    keywords: ["simple marriage biodata", "simple biodata format", "minimal biodata", "clean marriage biodata"],
    contentBlocks: {
      introduction:
        "Sometimes less is more. Our simple marriage biodata templates feature clean designs, professional typography, and elegant layouts that let your information shine without distractions.",
      benefits: [
        "Clean, distraction-free design",
        "Professional appearance",
        "Easy to read and understand",
        "Modern and elegant",
        "Perfect for printing",
        "Universally appealing",
      ],
      features: [
        "Minimal design templates",
        "Clear typography",
        "Structured information layout",
        "Subtle decorative elements",
        "Balanced white space",
        "Print-optimized",
      ],
      whoIsItFor: [
        "Professionals who prefer minimalism",
        "Families wanting a clean format",
        "Modern individuals seeking simplicity",
        "Anyone who values readability",
      ],
      usage:
        "Select from our Modern Minimal collection for the cleanest designs. Fill in your details and get a beautifully formatted simple biodata that's professional and easy to read.",
    },
    faqs: [
      { question: "Which templates are considered simple?", answer: "Our Modern Minimal collection features the cleanest, most elegant designs with professional formatting." },
      { question: "Can simple biodatas still look impressive?", answer: "Absolutely! Clean design with professional typography often makes the strongest impression." },
    ],
    relatedPages: ["marriage-biodata-maker", "professional-marriage-biodata", "editable-marriage-biodata"],
  },
  {
    slug: "professional-marriage-biodata",
    title: "Professional Marriage Biodata — Impressive Templates | ShaadiBio",
    description:
      "Create a professional marriage biodata that makes a lasting impression. Premium templates with expert typography and elegant formatting.",
    h1: "Professional Marriage Biodata — Make a Lasting First Impression",
    keywords: ["professional marriage biodata", "professional biodata format", "impressive biodata", "premium biodata maker"],
    contentBlocks: {
      introduction:
        "Your marriage biodata is often the first impression you make. Our professional templates combine expert typography, elegant color schemes, and refined layouts to create biodatas that stand out.",
      benefits: [
        "Premium quality design",
        "Expert typography choices",
        "Refined color palettes",
        "Impressive first impression",
        "Suitable for all occasions",
        "Print and digital ready",
      ],
      features: [
        "50+ professional templates",
        "Curated font combinations",
        "Elegant section layouts",
        "Photo integration",
        "Decorative elements",
        "HD quality output",
      ],
      whoIsItFor: [
        "Professionals and executives",
        "Families wanting premium quality",
        "Those seeking impressive presentation",
        "Anyone valuing design excellence",
      ],
      usage:
        "Browse our collections to find the professional style that matches your personality — from Royal grandeur to Modern elegance. Fill your details and download a biodata that impresses.",
    },
    faqs: [
      { question: "What makes a biodata professional?", answer: "Professional biodatas use expert typography, balanced layouts, refined colors, and clean design to create a polished, impressive presentation." },
      { question: "Which collection is most professional?", answer: "The Luxury Gold and Modern Minimal collections are extremely professional, but all our templates are designed to a professional standard." },
    ],
    relatedPages: ["marriage-biodata-maker", "marriage-biodata-pdf", "marriage-profile-template"],
  },
  {
    slug: "bride-marriage-biodata",
    title: "Bride Marriage Biodata — Beautiful Templates for Brides | ShaadiBio",
    description:
      "Create a beautiful marriage biodata for brides. Elegant floral, royal, and traditional designs perfect for showcasing the bride's profile.",
    h1: "Bride Marriage Biodata — Beautiful Designs for the Modern Bride",
    keywords: ["bride marriage biodata", "biodata for bride", "bride biodata format", "girl marriage biodata"],
    contentBlocks: {
      introduction:
        "Create a stunning marriage biodata that beautifully represents the bride. Our Floral, Elegant, and Royal collections feature designs that are perfect for showcasing a bride's profile with grace and sophistication.",
      benefits: [
        "Feminine and elegant designs",
        "Floral and romantic themes",
        "Graceful typography",
        "Beautiful color palettes",
        "Photo-friendly layouts",
        "Culturally appropriate",
      ],
      features: [
        "Floral collection templates",
        "Elegant & Graceful designs",
        "Soft color schemes",
        "Decorative borders",
        "Photo placement options",
        "Traditional motifs",
      ],
      whoIsItFor: [
        "Brides creating their own biodata",
        "Parents preparing daughter's biodata",
        "Families seeking feminine designs",
        "Those wanting romantic aesthetics",
      ],
      usage:
        "Explore our Floral or Elegant collections for bride-specific designs. Choose a template that reflects her personality, fill in the details, and create a beautiful biodata she'll be proud of.",
    },
    faqs: [
      { question: "Which templates are best for brides?", answer: "Our Floral and Elegant collections are designed with brides in mind, featuring soft colors, romantic typography, and feminine design elements." },
      { question: "Can I include a photo?", answer: "Yes! All our templates support photo upload with elegant frames and placement options." },
    ],
    relatedPages: ["groom-marriage-biodata", "marriage-biodata-maker", "marriage-profile-template"],
  },
  {
    slug: "groom-marriage-biodata",
    title: "Groom Marriage Biodata — Impressive Templates for Grooms | ShaadiBio",
    description:
      "Create an impressive marriage biodata for grooms. Royal, professional, and heritage designs that showcase the groom's profile with distinction.",
    h1: "Groom Marriage Biodata — Distinguished Designs for the Modern Groom",
    keywords: ["groom marriage biodata", "biodata for groom", "groom biodata format", "boy marriage biodata"],
    contentBlocks: {
      introduction:
        "Create a distinguished marriage biodata that commands attention. Our Royal, Heritage, and Modern collections feature bold designs perfect for showcasing a groom's profile with authority and elegance.",
      benefits: [
        "Bold and distinguished designs",
        "Royal and heritage themes",
        "Strong typography",
        "Commanding color palettes",
        "Professional presentation",
        "Culturally rich options",
      ],
      features: [
        "Royal collection templates",
        "Heritage designs",
        "Professional layouts",
        "Bold decorative elements",
        "Photo integration",
        "Traditional motifs",
      ],
      whoIsItFor: [
        "Grooms creating their own biodata",
        "Parents preparing son's biodata",
        "Families seeking distinguished designs",
        "Those wanting bold aesthetics",
      ],
      usage:
        "Browse our Royal or Heritage collections for groom-specific designs. Choose a template that reflects his personality and achievements, fill in the details, and create an impressive biodata.",
    },
    faqs: [
      { question: "Which templates are best for grooms?", answer: "Our Royal and Heritage collections feature bold, distinguished designs that are perfect for groom biodatas." },
      { question: "Can I highlight career achievements?", answer: "Yes! All our templates include dedicated sections for education and career details." },
    ],
    relatedPages: ["bride-marriage-biodata", "marriage-biodata-maker", "professional-marriage-biodata"],
  },
  {
    slug: "editable-marriage-biodata",
    title: "Editable Marriage Biodata — Edit & Download Instantly | ShaadiBio",
    description:
      "Create an editable marriage biodata you can modify anytime. Fill, edit, preview, and download — all from your browser.",
    h1: "Editable Marriage Biodata — Modify Anytime, Download Instantly",
    keywords: ["editable marriage biodata", "editable biodata format", "edit biodata online", "modifiable marriage biodata"],
    contentBlocks: {
      introduction:
        "Need to update your biodata? ShaadiBio gives you a fully editable marriage biodata experience. Make changes anytime, preview instantly, and download when you're satisfied.",
      benefits: [
        "Edit anytime from your browser",
        "Instant preview of changes",
        "No software download needed",
        "Works on mobile and desktop",
        "Unlimited edits before download",
        "Save time with quick updates",
      ],
      features: [
        "Browser-based editor",
        "Real-time preview",
        "All fields editable",
        "Photo replacement",
        "Template switching",
        "Instant PDF generation",
      ],
      whoIsItFor: [
        "Anyone who needs to update biodata frequently",
        "Families creating multiple biodatas",
        "People who want flexibility",
        "Those who prefer online tools",
      ],
      usage:
        "Start creating your biodata with our online editor. Make changes to any field, see the preview update in real-time, switch templates if you like, and download when you're happy with the result.",
    },
    faqs: [
      { question: "Can I edit after downloading?", answer: "You can come back and create a new version anytime. The PDF itself is a final document, but you can regenerate it with updated information." },
      { question: "Is there a limit on edits?", answer: "No! Edit as many times as you want before downloading. There's no limit on previews or changes." },
    ],
    relatedPages: ["marriage-biodata-maker", "free-marriage-biodata-maker", "marriage-biodata-pdf"],
  },
  {
    slug: "marriage-biodata-pdf",
    title: "Marriage Biodata PDF — Download HD Quality PDF | ShaadiBio",
    description:
      "Download your marriage biodata as a high-quality PDF. Print-ready format, no watermark, professional quality. Ready in 3 minutes.",
    h1: "Marriage Biodata PDF — Print-Ready HD Quality Download",
    keywords: ["marriage biodata pdf", "biodata pdf download", "marriage biodata pdf format", "biodata pdf maker"],
    contentBlocks: {
      introduction:
        "Get your marriage biodata as a premium-quality PDF that's perfect for printing or sharing digitally. Our HD PDFs are crisp, professional, and ready to impress.",
      benefits: [
        "High-resolution PDF output",
        "No watermark on paid version",
        "Print-ready quality",
        "Perfect for sharing via WhatsApp",
        "Professional formatting retained",
        "Instant download",
      ],
      features: [
        "HD quality PDF generation",
        "300 DPI print resolution",
        "Embedded fonts",
        "Color-accurate output",
        "Optimized file size",
        "Universal compatibility",
      ],
      whoIsItFor: [
        "Families wanting to print biodatas",
        "Those sharing biodata via messaging apps",
        "Matrimonial agents needing print copies",
        "Anyone wanting professional quality",
      ],
      usage:
        "Create your biodata using any of our 50+ templates, preview it, and click download. Your HD PDF will be generated instantly and ready to print or share.",
    },
    faqs: [
      { question: "What's the PDF quality?", answer: "Our PDFs are generated at high resolution suitable for professional printing. Fonts, colors, and layouts are preserved perfectly." },
      { question: "Can I print the PDF?", answer: "Absolutely! Our PDFs are designed to be print-ready. They look great on A4 paper." },
    ],
    relatedPages: ["marriage-biodata-maker", "free-marriage-biodata-maker", "editable-marriage-biodata"],
  },
  {
    slug: "marriage-profile-template",
    title: "Marriage Profile Template — Ready-Made Biodata Templates | ShaadiBio",
    description:
      "Browse 50+ ready-made marriage profile templates. Royal, Floral, Traditional, Modern, Luxury & Heritage collections. Pick, fill, download.",
    h1: "Marriage Profile Template — 50+ Ready-Made Designs",
    keywords: ["marriage profile template", "biodata template", "marriage biodata template", "shaadi profile template"],
    contentBlocks: {
      introduction:
        "Skip the design hassle with our ready-made marriage profile templates. Choose from 50+ professionally designed templates across 8 collections — each crafted by design experts for the perfect biodata.",
      benefits: [
        "50+ ready-to-use templates",
        "8 curated collections",
        "Professionally designed",
        "No design skills needed",
        "Consistent quality",
        "Regular new additions",
      ],
      features: [
        "Royal collection",
        "Floral designs",
        "Traditional Hindu motifs",
        "Modern minimal styles",
        "Luxury gold themes",
        "Heritage parchment",
      ],
      whoIsItFor: [
        "Anyone wanting a pre-designed biodata",
        "Families with no design background",
        "Those who want quick results",
        "People seeking variety in choices",
      ],
      usage:
        "Browse our collections page to see all available templates. Click on any template to start filling your details. Preview your biodata with that template and switch between designs until you find the perfect one.",
    },
    faqs: [
      { question: "How many templates are available?", answer: "We have 50+ premium templates across 8 collections: Royal, Floral, Traditional, Modern, Luxury, Heritage, Elegant, and Regional." },
      { question: "Can I switch templates after filling details?", answer: "Yes! Your information stays the same — you can preview it in any template before downloading." },
    ],
    relatedPages: ["marriage-biodata-maker", "professional-marriage-biodata", "biodata-format-for-marriage"],
  },
  {
    slug: "biodata-format-for-marriage",
    title: "Biodata Format for Marriage — Best Formats & Examples | ShaadiBio",
    description:
      "Find the best biodata format for marriage. 50+ professionally designed formats with proper structure, sections, and layout. Create yours in minutes.",
    h1: "Biodata Format for Marriage — Choose the Best Format for You",
    keywords: ["biodata format for marriage", "marriage biodata format", "best biodata format", "biodata format download"],
    contentBlocks: {
      introduction:
        "Not sure what format to use for your marriage biodata? We offer 50+ professionally structured formats that include all essential sections — personal details, family background, education, career, expectations, and more.",
      benefits: [
        "Properly structured formats",
        "All essential sections included",
        "Professional layout and design",
        "Guidance on what to include",
        "Multiple style options",
        "Tested and proven formats",
      ],
      features: [
        "Personal details section",
        "Family background section",
        "Education & career",
        "Partner expectations",
        "Contact information",
        "Photo placement",
      ],
      whoIsItFor: [
        "First-time biodata creators",
        "Families unsure about format",
        "Those wanting proper structure",
        "Anyone seeking guidance on sections",
      ],
      usage:
        "Browse our formats, select one that appeals to you, and our guided form will walk you through filling each section. We ensure your biodata has all the information families typically look for.",
    },
    faqs: [
      { question: "What should a marriage biodata include?", answer: "A complete marriage biodata includes personal details (name, DOB, height), family information, education, career, hobbies, partner expectations, and contact details." },
      { question: "Which format is most popular?", answer: "Our Royal and Traditional formats are the most popular, but Modern Minimal is gaining popularity among urban families." },
    ],
    relatedPages: ["marriage-biodata-maker", "marriage-profile-template", "simple-marriage-biodata"],
  },
];

export function getKeywordBySlug(slug: string): KeywordConfig | undefined {
  return KEYWORD_PAGES.find((k) => k.slug === slug);
}

export function getAllKeywordSlugs(): string[] {
  return KEYWORD_PAGES.map((k) => k.slug);
}

export function getKeywordUrl(slug: string): string {
  return `${SITE_URL}/${slug}`;
}
