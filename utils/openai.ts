import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateHabitSuggestions(currentHabits: string[]) {
  const prompt = `Based on these current habits: ${currentHabits.join(
    ", "
  )}, suggest 3 new complementary habits that would help build a well-rounded routine. Format the response as a JSON array of strings.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  const response = JSON.parse(completion.choices[0].message.content || "[]");
  return response.suggestions || [];
}

export async function generateMotivationalMessage(
  habitName: string,
  streak: number
) {
  const prompt = `Generate a short, encouraging message for someone who missed their "${habitName}" habit. They had a ${streak}-day streak. Keep it positive and motivating.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    max_tokens: 100,
  });

  return completion.choices[0].message.content || "";
}

export async function parseHabitFromText(text: string) {
  const prompt = `Parse the following text into a structured habit. Extract the habit name, frequency, and any specific details. Format the response as a JSON object with fields: name, frequency (daily/weekly), and details (optional). Text: "${text}"`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content || "{}");
} 