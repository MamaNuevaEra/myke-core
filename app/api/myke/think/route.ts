import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You are Myke. Help the user discover financial vocation and purpose." },
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({
      reply: response.choices[0]?.message?.content ?? "",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
