import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Safety Check: Is the API Key even loading?
    if (!process.env.GEMINI_API_KEY) {
      console.error("CRITICAL: GEMINI_API_KEY is missing from environment variables.");
      return NextResponse.json({ error: 'API Key missing from server' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { text, urls } = await req.json();

    if (!text) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

// The globally available, ultra-stable 1.0 architecture
const model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });

    const prompt = `
      You are an expert technical SEO internal linker. 
      I am giving you a draft paragraph of HTML content:
      "${text}"

      Here is a list of my website's core URLs and what they represent:
      ${urls.join('\n')}

      YOUR TASK:
      1. Analyze the draft text.
      2. Find 1 or 2 highly relevant keywords or phrases.
      3. Wrap those keywords in an HTML <a> tag pointing to the most relevant URL from the list provided.
      4. Add this exact class to every <a> tag: class="text-[#008dd8] hover:underline font-bold transition-colors"
      5. DO NOT force a link if it does not naturally fit.
      6. Return ONLY the raw updated HTML string. Do not wrap it in markdown blockquotes like \`\`\`html.
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text().trim();

    const cleanHtml = aiResponse.replace(/^```html\s*/i, '').replace(/```\s*$/i, '');

    return NextResponse.json({ updatedText: cleanHtml });

  } catch (error) {
    // 3. Expose the actual Google API error to the frontend
    console.error('Detailed AI Linking Error:', error.message || error);
    return NextResponse.json({ 
      error: 'Google API Error', 
      details: error.message || "Unknown server error" 
    }, { status: 500 });
  }
}