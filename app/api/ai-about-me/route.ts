import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTemplateById } from "@/lib/templates/collections";
import { BiodataFormData } from "@/types";
import { formatDate, calculateAge } from "@/lib/utils";

// POST /api/ai-about-me  — generate AI-written About Me
export async function POST(request: NextRequest) {
  const { name, profession, education, hobbies } = await request.json() as {
    name: string;
    profession: string;
    education: string;
    hobbies: string;
  };

  // Simple template-based generator (replace with OpenAI call when API key is configured)
  const templates = [
    `I am ${name || "a warm and family-oriented person"}, a ${education ? education + " graduate" : "well-educated individual"} currently working as ${profession || "a professional"}. I value family traditions while embracing modern values. I enjoy ${hobbies || "spending time with family, reading, and travelling"}. I am looking for a life partner who shares similar values and can be a supportive companion in building a beautiful family together.`,

    `${name ? name + " is" : "I am"} a sincere and caring individual with a ${education || "strong educational"} background, working as ${profession || "a dedicated professional"}. Being raised in a loving family, I believe in maintaining strong family bonds. My interests include ${hobbies || "music, cooking, and exploring new places"}. I seek a like-minded partner who values love, respect, and togetherness.`,

    `A ${education ? education + "-educated" : "well-qualified"} ${profession || "professional"}, I am someone who balances career ambitions with family values. I have a cheerful personality and love ${hobbies || "cooking, travelling, and spending time with loved ones"}. I believe a good marriage is built on mutual respect, understanding, and shared dreams.`,
  ];

  const text = templates[Math.floor(Math.random() * templates.length)];

  return NextResponse.json({ text });
}
