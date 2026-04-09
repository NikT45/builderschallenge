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

export async function uploadDocument(file: File, userId?: string): Promise<{ documentId: string; name: string; chunks: number }> {
  const form = new FormData()
  form.append("file", file)
  if (userId) form.append("userId", userId)
  const res = await fetch(`${BACKEND_URL}/documents/upload`, { method: "POST", body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }))
    throw new Error(err.error ?? "Upload failed")
  }
  return res.json()
}

export async function listDocuments(userId?: string): Promise<DocumentItem[]> {
  const params = userId ? `?userId=${encodeURIComponent(userId)}` : ""
  const res = await fetch(`${BACKEND_URL}/documents${params}`)
  if (!res.ok) return []
  return res.json()
}

export async function deleteDocument(id: string): Promise<void> {
  await fetch(`${BACKEND_URL}/documents/${id}`, { method: "DELETE" })
}

export interface DocumentItem {
  id: string
  name: string
  size: number
  mime_type: string
  created_at: string
}
