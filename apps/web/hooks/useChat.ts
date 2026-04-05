"use client"

import { useState, useCallback, useRef } from "react"
import { v4 as uuidv4 } from "uuid"
import { streamChat } from "@/lib/api"
import { readSSEStream } from "@/lib/sse"
import type { Message } from "@/lib/types"

interface UseChatReturn {
  messages: Message[]
  isStreaming: boolean
  ddJobId: string | null
  ddCompany: string | null
  sendMessage: (content: string) => Promise<void>
  clearDdJob: () => void
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [ddJobId, setDdJobId] = useState<string | null>(null)
  const [ddCompany, setDdCompany] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (isStreaming) return

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

    abortRef.current = new AbortController()

    try {
      const response = await streamChat(nextMessages)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      for await (const event of readSSEStream(response)) {
        if (event.type === "text_delta") {
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
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id ? { ...m, isStreaming: false } : m
        )
      )
      setIsStreaming(false)
    }
  }, [messages, isStreaming])

  const clearDdJob = useCallback(() => {
    setDdJobId(null)
    setDdCompany(null)
  }, [])

  return { messages, isStreaming, ddJobId, ddCompany, sendMessage, clearDdJob }
}
