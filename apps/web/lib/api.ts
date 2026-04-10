import type { Message } from "./types"
import { createClient } from "@/utils/supabase/client"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000"

async function getAuthHeader(): Promise<{ Authorization: string }> {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new Error("Not authenticated")
  return { Authorization: `Bearer ${token}` }
}

export async function streamChat(messages: Message[]): Promise<Response> {
  const auth = await getAuthHeader()
  return fetch(`${BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  })
}

export async function triggerDD(company: string, context?: string): Promise<{ ddJobId: string }> {
  const auth = await getAuthHeader()
  const res = await fetch(`${BACKEND_URL}/dd`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: JSON.stringify({ company, context }),
  })
  return res.json()
}

export function streamDDProgress(jobId: string): Promise<Response> {
  return fetch(`${BACKEND_URL}/dd/${jobId}/stream`)
}

export async function uploadDocument(file: File): Promise<{ documentId: string; name: string; chunks: number }> {
  const auth = await getAuthHeader()
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${BACKEND_URL}/documents/upload`, { method: "POST", headers: auth, body: form })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Upload failed" }))
    throw new Error(err.error ?? "Upload failed")
  }
  return res.json()
}

export async function listDocuments(): Promise<DocumentItem[]> {
  const auth = await getAuthHeader()
  const res = await fetch(`${BACKEND_URL}/documents`, { headers: auth })
  if (!res.ok) return []
  return res.json()
}

export async function deleteDocument(id: string): Promise<void> {
  const auth = await getAuthHeader()
  await fetch(`${BACKEND_URL}/documents/${id}`, { method: "DELETE", headers: auth })
}

export interface DocumentItem {
  id: string
  name: string
  size: number
  mime_type: string
  created_at: string
}
