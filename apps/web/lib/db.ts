"use client"

import { createClient } from "@/utils/supabase/client"
import type { DDReport, Message, StructuredReport } from "@/lib/types"

// ─── Chats ───────────────────────────────────────────────────────────────────

export interface ChatRow {
  id: string
  title: string | null
  createdAt: string
  updatedAt: string
}

async function requireUserId(): Promise<string> {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw new Error("Not authenticated")
  return data.user.id
}

export async function createChat(title: string | null = null): Promise<ChatRow> {
  const supabase = createClient()
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from("chats")
    .insert({ user_id: userId, title })
    .select()
    .single()
  if (error) throw error
  return {
    id: data.id,
    title: data.title,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function listChats(): Promise<ChatRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("chats")
    .select("id, title, created_at, updated_at")
    .order("updated_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }))
}

export async function touchChat(chatId: string): Promise<void> {
  const supabase = createClient()
  await supabase
    .from("chats")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", chatId)
}

export async function updateChatTitle(chatId: string, title: string): Promise<void> {
  const supabase = createClient()
  await supabase.from("chats").update({ title }).eq("id", chatId)
}

export async function deleteChat(chatId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("chats").delete().eq("id", chatId)
  if (error) throw error
}

// ─── Messages ────────────────────────────────────────────────────────────────

export async function addMessage(
  chatId: string,
  role: "user" | "assistant",
  content: string
): Promise<void> {
  const supabase = createClient()
  const userId = await requireUserId()
  const { error } = await supabase
    .from("messages")
    .insert({ chat_id: chatId, user_id: userId, role, content })
  if (error) throw error
}

export async function loadMessages(chatId: string): Promise<Message[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("messages")
    .select("id, role, content")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return (data ?? []).map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
  }))
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export async function saveReport(
  report: DDReport,
  chatId: string | null = null
): Promise<string> {
  const supabase = createClient()
  const userId = await requireUserId()
  const { data, error } = await supabase
    .from("reports")
    .insert({
      user_id: userId,
      chat_id: chatId,
      company: report.company,
      report: report.report,
    })
    .select("id, created_at")
    .single()
  if (error) throw error
  return data.id
}

export async function listReports(): Promise<DDReport[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("reports")
    .select("id, company, report, created_at")
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => ({
    reportId: r.id,
    company: r.company,
    report: r.report as StructuredReport,
    createdAt: new Date(r.created_at).getTime(),
  }))
}

export async function deleteReport(reportId: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from("reports").delete().eq("id", reportId)
  if (error) throw error
}
