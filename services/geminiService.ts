
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateTikTokIdeas(topic: string): Promise<string[]> {
  try {
    const prompt = `
    أنت خبير في التسويق عبر تيك توك. قم بإنشاء 3 أفكار فريدة ومبتكرة لمقاطع فيديو تيك توك حول الموضوع التالي: "${topic}".
    يجب أن تكون الأفكار قصيرة وجذابة وسهلة التنفيذ.
    
    قدم الإجابة على شكل قائمة مرقمة بسيطة. مثال:
    1. فكرة الفيديو الأولى.
    2. فكرة الفيديو الثانية.
    3. فكرة الفيديو الثالثة.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    const text = response.text;
    
    // Split the text into an array of ideas
    const ideas = text.split('\n').filter(line => line.match(/^\d+\./)).map(line => line.replace(/^\d+\.\s*/, ''));
    
    if (ideas.length === 0 && text.length > 0) {
        return [text]; // Return the full text if splitting fails but there is a response
    }
    
    return ideas;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("فشل في إنشاء الأفكار. الرجاء المحاولة مرة أخرى.");
  }
}
