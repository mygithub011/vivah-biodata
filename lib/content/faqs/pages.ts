export interface FaqPage {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  questions: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export const FAQ_PAGES: FaqPage[] = [
  {
    slug: "how-to-create-marriage-biodata",
    title: "How to Create Marriage Biodata — FAQ",
    description:
      "Frequently asked questions about creating a marriage biodata. Step-by-step answers on format, content, photos, and more.",
    keywords: ["how to create marriage biodata", "biodata creation faq", "marriage biodata help"],
    questions: [
      {
        question: "How do I create a marriage biodata?",
        answer:
          "To create a marriage biodata with ShaadiBio: 1) Browse our collections and choose a template, 2) Fill in your personal, family, education, and career details using our guided form, 3) Upload your photo, 4) Preview your biodata, 5) Download the HD PDF. The entire process takes just 3 minutes.",
      },
      {
        question: "What information should I include in my biodata?",
        answer:
          "A complete marriage biodata should include: Personal details (name, DOB, height, complexion), Family background (parents' names and occupations, siblings), Education (degrees, university), Career (job title, company), Hobbies, Partner expectations, and Contact information.",
      },
      {
        question: "Do I need to create an account?",
        answer:
          "No! ShaadiBio requires no signup or registration. You can start creating your biodata immediately and download it without creating any account.",
      },
      {
        question: "Can I create a biodata on my phone?",
        answer:
          "Yes, ShaadiBio is fully mobile-friendly. You can create, preview, and download your biodata from any smartphone or tablet.",
      },
      {
        question: "How long does it take to create a biodata?",
        answer:
          "Most users complete their biodata in 3-5 minutes. Our guided form makes it easy to fill all sections quickly.",
      },
    ],
    relatedSlugs: ["best-marriage-biodata-format", "what-photo-to-use", "what-details-to-include"],
  },
  {
    slug: "best-marriage-biodata-format",
    title: "Best Marriage Biodata Format — FAQ",
    description:
      "Questions about choosing the best format for your marriage biodata. Traditional vs modern, which template to pick, and more.",
    keywords: ["best biodata format", "biodata format faq", "which biodata template"],
    questions: [
      {
        question: "What is the best format for a marriage biodata?",
        answer:
          "The best format depends on your style. Traditional families often prefer royal or heritage designs with ornate borders. Modern professionals may prefer clean, minimal layouts. ShaadiBio offers 50+ templates across 8 collections to match every preference.",
      },
      {
        question: "Should I use a traditional or modern biodata format?",
        answer:
          "Choose traditional if your family values cultural presentation and ornate design. Choose modern if you prefer clean lines and professional aesthetics. Both are equally effective — pick what represents your family best.",
      },
      {
        question: "How many pages should a biodata be?",
        answer:
          "Ideally 1-2 pages. A single page is most common and preferred as it's easy to share. Include all essential details without overcrowding.",
      },
      {
        question: "Can I switch between templates?",
        answer:
          "Yes! With ShaadiBio, you can preview your biodata in any template before downloading. Your information stays the same — only the design changes.",
      },
      {
        question: "What's the difference between biodata formats?",
        answer:
          "Formats differ in layout, typography, color scheme, and decorative elements. Royal formats use gold and ornate borders, Floral uses soft colors and flower motifs, Modern uses clean lines and minimal decoration, and Heritage uses traditional cultural elements.",
      },
    ],
    relatedSlugs: ["how-to-create-marriage-biodata", "what-details-to-include"],
  },
  {
    slug: "what-photo-to-use",
    title: "What Photo to Use in Marriage Biodata — FAQ",
    description:
      "Photo guidelines for marriage biodata. Best photo size, background, attire, and tips for making a great first impression.",
    keywords: ["biodata photo", "marriage biodata photo", "photo for biodata", "biodata photo tips"],
    questions: [
      {
        question: "What type of photo should I use in my biodata?",
        answer:
          "Use a recent (within 6 months), well-lit portrait photo. Dress in traditional or smart-casual attire. Use a plain or subtle background. Avoid selfies, group photos, or heavily filtered images.",
      },
      {
        question: "What size should my biodata photo be?",
        answer:
          "For best results, use a photo that's at least 600x800 pixels (3:4 aspect ratio). Higher resolution photos look better in the final PDF. JPEG or PNG format is recommended.",
      },
      {
        question: "Can I create a biodata without a photo?",
        answer:
          "Yes! While a photo enhances your biodata, all ShaadiBio templates work perfectly without one. The layout adjusts automatically.",
      },
      {
        question: "Should the photo be formal or casual?",
        answer:
          "Semi-formal is ideal. Traditional wear (saree, kurta) or smart-casual attire works best. Avoid overly casual clothing like t-shirts or party wear.",
      },
      {
        question: "What background works best for biodata photos?",
        answer:
          "A plain white, cream, or light-colored background works best. It keeps the focus on you and looks professional across all template styles.",
      },
    ],
    relatedSlugs: ["how-to-create-marriage-biodata", "what-details-to-include"],
  },
  {
    slug: "what-details-to-include",
    title: "What Details to Include in Marriage Biodata — FAQ",
    description:
      "Complete guide on what information to include in your marriage biodata. Essential sections, optional details, and what to avoid.",
    keywords: ["biodata details", "what to include in biodata", "marriage biodata sections", "biodata content"],
    questions: [
      {
        question: "What are the essential details for a marriage biodata?",
        answer:
          "Essential details include: Full name, Date of birth, Height, Education, Occupation, Family details (father and mother's names and occupations), Religion/Community, and Contact information.",
      },
      {
        question: "Should I mention salary in my biodata?",
        answer:
          "Mentioning salary is optional. Some families appreciate transparency while others prefer to discuss it later. You can mention a range or simply state your designation and company.",
      },
      {
        question: "How detailed should family information be?",
        answer:
          "Include parents' names and occupations, number of siblings, and their marital status/occupations. You can also mention grandparents or family business if relevant to your culture.",
      },
      {
        question: "Should I include partner expectations?",
        answer:
          "Yes, including partner expectations is recommended. Keep them reasonable and positive — mention preferred education level, age range, and values rather than rigid requirements.",
      },
      {
        question: "What should I NOT include in my biodata?",
        answer:
          "Avoid: Negative information, controversial opinions, excessive demands, false information, very personal medical details, or information that could be misused (full address, Aadhaar number, etc.).",
      },
      {
        question: "Should I include hobbies?",
        answer:
          "Yes! Hobbies show personality and give conversation starters. Include 3-5 genuine interests like reading, cooking, travelling, music, or sports.",
      },
    ],
    relatedSlugs: ["how-to-create-marriage-biodata", "best-marriage-biodata-format", "what-photo-to-use"],
  },
];

export function getFaqPageBySlug(slug: string): FaqPage | undefined {
  return FAQ_PAGES.find((f) => f.slug === slug);
}

export function getAllFaqSlugs(): string[] {
  return FAQ_PAGES.map((f) => f.slug);
}

export function getAllFaqQuestions(): { question: string; answer: string }[] {
  return FAQ_PAGES.flatMap((f) => f.questions);
}
