"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { DDReport } from "@/lib/types"

interface ReportViewerProps {
  report: DDReport
}

export function ReportViewer({ report }: ReportViewerProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border px-6">
        <div>
          <h1 className="text-[13px] font-semibold text-foreground">{report.company}</h1>
          <p className="font-mono text-[10px] text-muted-foreground">
            {new Date(report.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="rounded-[5px] border border-border bg-secondary px-3 py-1.5 font-mono text-[11px] text-secondary-foreground transition-colors hover:bg-muted"
        >
          Export PDF
        </button>
      </div>

      {/* Markdown content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-3xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mb-4 mt-8 text-2xl font-bold tracking-tight text-foreground first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mb-3 mt-8 border-b border-border pb-1.5 text-[17px] font-semibold text-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2 mt-5 text-[14px] font-semibold text-foreground">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-3 text-[13px] leading-relaxed text-foreground/90">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-3 list-disc space-y-1 pl-5 text-[13px] text-foreground/90">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-3 list-decimal space-y-1 pl-5 text-[13px] text-foreground/90">{children}</ol>
              ),
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              table: ({ children }) => (
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full border-collapse text-[12px]">{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="border-b border-border bg-muted/50">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="px-3 py-2 text-left font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border-b border-border px-3 py-2 text-[12px] text-foreground/90">
                  {children}
                </td>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              code: ({ children }) => (
                <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">{children}</code>
              ),
              hr: () => <hr className="my-6 border-border" />,
              blockquote: ({ children }) => (
                <blockquote className="my-3 border-l-2 border-primary pl-4 text-[13px] italic text-muted-foreground">
                  {children}
                </blockquote>
              ),
            }}
          >
            {report.markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
