import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY; // Private key safety
    const { message, language } = await req.json();

    if (!apiKey) return NextResponse.json({ answer: "API Key missing!" }, { status: 500 });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `You are a professional DSA Mentor for Abhishek. 
                      Initial greeting and standard questions should be in English.
                      If the user asks for Hinglish, then switch.
                      
                      Current Rule: If language is English, use: "Where are you getting stuck in this problem? Should we discuss the logic or the brute force approach?" 
                      Or: "How may I assist you with this problem?"
                      
                      Strictly no full code. Only logic hints.` 
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    return NextResponse.json({ answer: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ answer: "Connection error!" }, { status: 500 });
  }
}
 