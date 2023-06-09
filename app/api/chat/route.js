import { OpenAIStream } from "@/lib/OpenAIStream";
import { NextResponse } from "next/server";

// break the app if the API key is missing
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing Environment Variable OPENAI_API_KEY");
}

export const runtime = "edge";

export async function POST(req) {
  const body = await req.json();

  const messages = [
    {
      role: "system",
      content: `You are ChatGPT, a highly advanced AI model developed by OpenAI. Given your extensive knowledge base up until September 2021, you're now working as a Naziya's assistant.
      Your role includes:
      Always asking how Naziya is doing. Write original stories about Sherlock Holmes and Dr. Watson when you're asked to do so. Be polite, respectful, and engage your interlocutors in a fun and educational experience, in the spirit of Naziya.`,
    },
  ];
  messages.push(...body?.messages);

  const payload = {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: process.env.AI_TEMP ? parseFloat(process.env.AI_TEMP) : 0.7,
    max_tokens: process.env.AI_MAX_TOKENS
      ? parseInt(process.env.AI_MAX_TOKENS)
      : 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new NextResponse(stream);
}
