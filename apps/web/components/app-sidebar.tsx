"use client"

import { useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

export type Tab = "reports" | "documents" | "settings"

// ─── Icons ───────────────────────────────────────────────────────────────────

function ReportsIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  )
}

function DocumentsIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-3.5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export interface ChatListItem {
  id: string
  title: string | null
}

interface AppSidebarProps {
  activeTab: Tab | null
  onTabChange: (tab: Tab | null) => void
  chats?: ChatListItem[]
  activeChatId?: string | null
  onSelectChat?: (chatId: string) => void
  onNewChat?: () => void
}

const navItems: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "reports", label: "Reports", Icon: ReportsIcon },
  { id: "documents", label: "Documents", Icon: DocumentsIcon },
]

export function AppSidebar({ activeTab, onTabChange, chats = [], activeChatId, onSelectChat, onNewChat }: AppSidebarProps) {
  const [chatsOpen, setChatsOpen] = useState(true)

  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Wordmark */}
      <div className="flex h-[52px] items-center gap-2.5 border-b border-sidebar-border px-4">
        <button
          onClick={() => onTabChange(null)}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <div className="flex size-6 items-center justify-center rounded-[4px] bg-primary">
            <span className="text-[10px] font-bold leading-none text-primary-foreground">⬡</span>
          </div>
          <div className="leading-tight text-left">
            <p className="text-[13px] font-semibold tracking-tight text-sidebar-foreground">Anvil</p>
            <p className="font-mono text-[10px] text-muted-foreground">AI · Research</p>
          </div>
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto p-2 pt-3">

        {/* ── Chats section ── */}
        <div className="mb-1 flex flex-col gap-0.5">
          {/* New Chat button */}
          <button
            onClick={() => { onNewChat?.(); onTabChange(null) }}
            className={cn(
              "group relative flex w-full items-center gap-2.5 rounded-[5px] px-2 py-[7px] text-[13px] transition-colors duration-100",
              activeTab === null
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            )}
          >
            {activeTab === null && (
              <span className="absolute bottom-1.5 left-0 top-1.5 w-[2px] rounded-full bg-primary" />
            )}
            <svg className={cn("size-4 shrink-0 transition-colors", activeTab === null ? "text-primary" : "text-muted-foreground/70 group-hover:text-muted-foreground")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>

          {/* Chats dropdown button */}
          <button
            onClick={() => setChatsOpen((o) => !o)}
            className={cn(
              "group relative flex w-full items-center gap-2.5 rounded-[5px] px-2 py-[7px] text-[13px] transition-colors duration-100",
              chatsOpen
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            )}
          >
            {chatsOpen && (
              <span className="absolute bottom-1.5 left-0 top-1.5 w-[2px] rounded-full bg-primary" />
            )}
            <ChatBubbleIcon className={cn("size-4 shrink-0 transition-colors", chatsOpen ? "text-primary" : "text-muted-foreground/70 group-hover:text-muted-foreground")} />
            <span className="flex-1 text-left">Chats</span>
            <ChevronIcon
              className={cn("shrink-0 transition-transform duration-150", chatsOpen ? "rotate-0" : "-rotate-90")}
            />
          </button>

          {/* Chat list */}
          {chatsOpen && (
            <div className="ml-2 mt-0.5 border-l border-sidebar-border pl-3">
              {chats.length === 0 ? (
                <p className="py-2 font-mono text-[11px] text-muted-foreground/40">
                  No previous chats
                </p>
              ) : (
                chats.map((chat) => {
                  const isActive = chat.id === activeChatId
                  return (
                    <button
                      key={chat.id}
                      onClick={() => { onSelectChat?.(chat.id); onTabChange(null) }}
                      className={cn(
                        "group flex w-full items-center gap-2 rounded-[5px] px-2 py-[6px] text-left transition-colors",
                        isActive ? "bg-sidebar-accent/80" : "hover:bg-sidebar-accent/60"
                      )}
                    >
                      <span className={cn(
                        "flex-1 truncate font-mono text-[11px]",
                        isActive ? "text-sidebar-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground"
                      )}>
                        {chat.title || "Untitled"}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="my-2 border-t border-sidebar-border" />

        {/* ── Reports & Documents ── */}
        <div className="flex flex-col gap-0.5">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "group relative flex w-full items-center gap-2.5 rounded-[5px] px-2 py-[7px] text-[13px] transition-colors duration-100",
                activeTab === id
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              {activeTab === id && (
                <span className="absolute bottom-1.5 left-0 top-1.5 w-[2px] rounded-full bg-primary" />
              )}
              <Icon
                className={cn(
                  "transition-colors",
                  activeTab === id
                    ? "text-primary"
                    : "text-muted-foreground/70 group-hover:text-muted-foreground"
                )}
              />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Settings pinned to bottom */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={() => onTabChange("settings")}
          className={cn(
            "group relative flex w-full items-center gap-2.5 rounded-[5px] px-2 py-[7px] text-[13px] transition-colors duration-100",
            activeTab === "settings"
              ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          )}
        >
          {activeTab === "settings" && (
            <span className="absolute bottom-1.5 left-0 top-1.5 w-[2px] rounded-full bg-primary" />
          )}
          <SettingsIcon
            className={cn(
              "transition-colors",
              activeTab === "settings"
                ? "text-primary"
                : "text-muted-foreground/70 group-hover:text-muted-foreground"
            )}
          />
          Settings
        </button>
      </div>
    </aside>
  )
}
