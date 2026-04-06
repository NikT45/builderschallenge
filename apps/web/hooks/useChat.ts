"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { streamChat } from "@/lib/api"
import { readSSEStream } from "@/lib/sse"
import { createChat, addMessage, touchChat, updateChatTitle, loadMessages } from "@/lib/db"
import { REPORT_CARD_PREFIX, type Message } from "@/lib/types"

interface UseChatReturn {
  messages: Message[]
  isStreaming: boolean
  ddJobId: string | null
  ddCompany: string | null
  chatId: string | null
  sendMessage: (content: string) => Promise<void>
  appendReportCard: (card: { reportId: string; company: string; verdict: "Favorable" | "Cautious" | "Unfavorable" }, text?: string) => void
  clearDdJob: () => void
}

export function useChat(initialChatId: string | null = null, onChatCreated?: (chatId: string) => void): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [ddJobId, setDdJobId] = useState<string | null>(null)
  const [ddCompany, setDdCompany] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(initialChatId)
  const abortRef = useRef<AbortController | null>(null)

  // Load history if we start with an existing chatId
  useEffect(() => {
    if (!initialChatId) return
    loadMessages(initialChatId)
      .then((loaded) => setMessages(loaded.map(decodeReportCard)))
      .catch((e) => console.error("Failed to load messages:", e))
  }, [initialChatId])

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming) return

    // Create chat on first message
    let activeChatId = chatId
    if (!activeChatId) {
      try {
        const title = content.slice(0, 60)
        const chat = await createChat(title)
        activeChatId = chat.id
        setChatId(activeChatId)
        onChatCreated?.(activeChatId)
      } catch (err) {
        console.error("Failed to create chat:", err)
      }
    }

    const userMsg: Message = { id: uuidv4(), role: "user", content }
    const assistantMsg: Message = {
      id: uuidv4(),
      role: "assistant",
      content: "",
      isStreaming: true,
    }

    const nextMessages = [...messages, userMsg]
    setMessages([...nextMessages, assistantMsg])
    setIsStreaming(true)

    // Persist user message (fire-and-forget)
    if (activeChatId) {
      addMessage(activeChatId, "user", content).catch((e) =>
        console.error("Failed to persist user msg:", e)
      )
      // Set title if this is the first message
      if (messages.length === 0) {
        updateChatTitle(activeChatId, content.slice(0, 60)).catch(() => {})
      }
    }

    abortRef.current = new AbortController()
    let assistantContent = ""

    try {
      const response = await streamChat(nextMessages)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      for await (const event of readSSEStream(response)) {
        if (event.type === "text_delta") {
          assistantContent += event.delta
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: m.content + event.delta }
                : m
            )
          )
        } else if (event.type === "dd_triggered") {
          setDdJobId(event.ddJobId)
          setDdCompany(event.company)
          // If no text was streamed before the tool fired, inject a canned opener
          if (!assistantContent) {
            assistantContent = `On it — starting a full due diligence on **${event.company}**. I'll work through financials, market position, risk factors, and management. This takes a couple of minutes.`
          }
        } else if (event.type === "done") {
          break
        } else if (event.type === "error") {
          console.error("Chat error:", event.message)
          break
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Stream error:", err)
      }
    } finally {
      const finalContent = assistantContent
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id ? { ...m, content: finalContent, isStreaming: false } : m
        )
      )
      setIsStreaming(false)

      // Persist assistant message + bump chat updated_at
      if (activeChatId && assistantContent) {
        addMessage(activeChatId, "assistant", assistantContent).catch((e) =>
          console.error("Failed to persist assistant msg:", e)
        )
        touchChat(activeChatId).catch(() => {})
      }
    }
  }, [messages, isStreaming, chatId, onChatCreated])

  const appendReportCard = useCallback(
    (card: { reportId: string; company: string; verdict: "Favorable" | "Cautious" | "Unfavorable" }, text?: string) => {
      const msg: Message = {
        id: uuidv4(),
        role: "assistant",
        content: text ?? "",
        reportCard: card,
      }
      setMessages((prev) => [...prev, msg])
      if (chatId) {
        const encoded = REPORT_CARD_PREFIX + JSON.stringify({ ...card, text })
        addMessage(chatId, "assistant", encoded).catch((e) =>
          console.error("Failed to persist report card:", e)
        )
        touchChat(chatId).catch(() => {})
      }
    },
    [chatId]
  )

  const clearDdJob = useCallback(() => {
    setDdJobId(null)
    setDdCompany(null)
  }, [])

  return { messages, isStreaming, ddJobId, ddCompany, chatId, sendMessage, appendReportCard, clearDdJob }
}

function decodeReportCard(m: Message): Message {
  if (!m.content.startsWith(REPORT_CARD_PREFIX)) return m
  try {
    const { text, ...card } = JSON.parse(m.content.slice(REPORT_CARD_PREFIX.length))
    return { ...m, content: text ?? "", reportCard: card }
  } catch {
    return m
  }
}
