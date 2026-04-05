"use client"

import { cn } from "@workspace/ui/lib/utils"

export type Tab = "chat" | "reports" | "documents" | "settings"

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("size-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

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

interface AppSidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const navItems: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: "chat", label: "Chat", Icon: ChatIcon },
  { id: "reports", label: "Reports", Icon: ReportsIcon },
  { id: "documents", label: "Documents", Icon: DocumentsIcon },
]

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  return (
    <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Wordmark */}
      <div className="flex h-[52px] items-center gap-2.5 border-b border-sidebar-border px-4">
        <div className="flex size-6 items-center justify-center rounded-[4px] bg-primary">
          <span className="text-[10px] font-bold leading-none text-primary-foreground">⬡</span>
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold tracking-tight text-sidebar-foreground">Anvil</p>
          <p className="font-mono text-[10px] text-muted-foreground">AI · Research</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-2 pt-3">
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
