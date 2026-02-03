import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = String(body?.message ?? "").trim();

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Missing 'message' in body" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "OPENAI_API_KEY is missing in environment variables" },
        { status: 500 }
      );
    }

    // Call OpenAI Responses API
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
          {
            role: "system",
            content:
              "You are Myke. Be concise, clear, and helpful. Answer in the same language as the user.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json(
        { ok: false, error: "OpenAI error", details: data },
        { status: 500 }
      );
    }

    // Responses API often returns text in output_text
    const text =
      data?.output_text ??
      data?.output?.[0]?.content?.[0]?.text ??
      "";

    return NextResponse.json({ ok: true, reply: text, raw: data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
