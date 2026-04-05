import type { Message } from "./types"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000"

export async function streamChat(messages: Message[]): Promise<Response> {
  return fetch(`${BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  })
}

export async function triggerDD(company: string, context?: string): Promise<{ ddJobId: string }> {
  const res = await fetch(`${BACKEND_URL}/dd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, context }),
  })
  return res.json()
}

export function streamDDProgress(jobId: string): Promise<Response> {
  return fetch(`${BACKEND_URL}/dd/${jobId}/stream`)
}
