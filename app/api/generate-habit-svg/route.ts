import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import type { Habit } from "@prisma/client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { habitId, name } = await req.json();
    if (!habitId) {
      return NextResponse.json({ error: "Missing habitId" }, { status: 400 });
    }

    // Check if SVG already exists
    const habit: Habit | null = await prisma.habit.findUnique({ where: { id: habitId } });
    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }
    if (habit.backgroundSvgUrl) {
      return NextResponse.json({ backgroundSvgUrl: habit.backgroundSvgUrl });
    }
    const prompt = `Generate a minimal, modern SVG illustration for the habit: '${name || habit.name}'. Use soft pastel colors, no text, and a clean style. Return only the SVG markup.`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // or gpt-3.5-turbo if needed
      messages: [
        { role: "system", content: "You are an SVG image generator." },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      response_format: { type: "text" },
    });
    const svg = completion.choices[0].message.content?.trim();
    if (!svg || !svg.startsWith("<svg")) {
      return NextResponse.json({ error: "Failed to generate SVG" }, { status: 500 });
    }

    // Store SVG as a data URL (for demo; in production, consider S3 or CDN)
    const svgBase64 = Buffer.from(svg).toString("base64");
    const backgroundSvgUrl = `data:image/svg+xml;base64,${svgBase64}`;
    await prisma.habit.update({
      where: { id: habitId },
      data: { backgroundSvgUrl },
    });
    return NextResponse.json({ backgroundSvgUrl });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
} 