"use client"

import React, { useState } from "react"
import { CheckCircle2, Circle, CircleAlert, CircleDotDashed, CircleX } from "lucide-react"
import { motion, AnimatePresence, LayoutGroup, type Variants } from "framer-motion"

export type PlanTaskStatus = "pending" | "in-progress" | "completed" | "failed" | "need-help"

export interface PlanSubtask {
  id: string
  title: string
  description?: string
  status: PlanTaskStatus
  tools?: string[]
}

export interface PlanTask {
  id: string
  title: string
  description?: string
  status: PlanTaskStatus
  subtasks?: PlanSubtask[]
}

interface AgentPlanProps {
  tasks: PlanTask[]
}

const prefersReducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false

const EASE = [0.2, 0.65, 0.3, 0.9] as const

const taskVariants: Variants = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: prefersReducedMotion
      ? { type: "tween", duration: 0.2 }
      : { type: "spring", stiffness: 500, damping: 30 },
  },
}

const subtaskListVariants: Variants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: {
    height: "auto",
    opacity: 1,
    overflow: "visible",
    transition: {
      duration: 0.25,
      staggerChildren: prefersReducedMotion ? 0 : 0.05,
      when: "beforeChildren",
      ease: EASE,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    overflow: "hidden",
    transition: { duration: 0.2, ease: EASE },
  },
}

const subtaskVariants: Variants = {
  hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: prefersReducedMotion
      ? { type: "tween", duration: 0.2 }
      : { type: "spring", stiffness: 500, damping: 25 },
  },
}

const subtaskDetailsVariants: Variants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  visible: {
    opacity: 1,
    height: "auto",
    overflow: "visible",
    transition: { duration: 0.25, ease: EASE },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: { duration: 0.15 },
  },
}

function StatusIcon({ status, size = "md" }: { status: PlanTaskStatus; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"
  const inner = {
    completed: <CheckCircle2 className={`${cls} text-green-500`} />,
    "in-progress": <CircleDotDashed className={`${cls} text-blue-500`} />,
    "need-help": <CircleAlert className={`${cls} text-yellow-500`} />,
    failed: <CircleX className={`${cls} text-red-500`} />,
    pending: <Circle className={`${cls} text-muted-foreground`} />,
  }[status]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
        transition={{ duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
      >
        {inner}
      </motion.div>
    </AnimatePresence>
  )
}

function StatusBadge({ status }: { status: PlanTaskStatus }) {
  const colors = {
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "need-help": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    pending: "bg-muted text-muted-foreground",
  }[status]

  return (
    <motion.span
      key={status}
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${colors}`}
      initial={{ scale: 1 }}
      animate={{
        scale: prefersReducedMotion ? 1 : [1, 1.08, 1],
        transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
      }}
    >
      {status === "in-progress" ? "running" : status}
    </motion.span>
  )
}

export function AgentPlan({ tasks }: AgentPlanProps) {
  const [expandedTasks, setExpandedTasks] = useState<string[]>(() =>
    tasks.filter((t) => t.status === "in-progress").map((t) => t.id)
  )
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({})

  const toggleTask = (id: string) =>
    setExpandedTasks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`
    setExpandedSubtasks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-background text-foreground h-full overflow-auto">
      <motion.div
        className="rounded-lg border border-border bg-card shadow overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] } }}
      >
        <LayoutGroup>
          <div className="p-3 overflow-hidden">
            <ul className="space-y-0.5 overflow-hidden">
              {tasks.map((task, index) => {
                const isExpanded = expandedTasks.includes(task.id)

                return (
                  <motion.li
                    key={task.id}
                    className={index !== 0 ? "mt-1 pt-1.5 border-t border-border/40" : ""}
                    initial="hidden"
                    animate="visible"
                    variants={taskVariants}
                  >
                    {/* Task row */}
                    <motion.div
                      className="group flex items-center px-2 py-1.5 rounded-md cursor-pointer"
                      whileHover={{ backgroundColor: "rgba(128,128,128,0.06)", transition: { duration: 0.2 } }}
                      onClick={() => toggleTask(task.id)}
                    >
                      <div className="mr-2 shrink-0">
                        <StatusIcon status={task.status} />
                      </div>
                      <div className="flex min-w-0 flex-1 items-center justify-between">
                        <span
                          className={`truncate text-[12px] font-medium ${
                            task.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </span>
                        <StatusBadge status={task.status} />
                      </div>
                    </motion.div>

                    {/* Subtasks */}
                    <AnimatePresence mode="wait">
                      {isExpanded && task.subtasks && task.subtasks.length > 0 && (
                        <motion.div
                          className="relative overflow-hidden"
                          variants={subtaskListVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                        >
                          <div className="absolute top-0 bottom-0 left-[18px] border-l border-dashed border-muted-foreground/25" />
                          <ul className="mt-0.5 mb-1 ml-3 mr-2 space-y-0.5">
                            {task.subtasks.map((subtask) => {
                              const key = `${task.id}-${subtask.id}`
                              const isSubExpanded = expandedSubtasks[key]

                              return (
                                <motion.li
                                  key={subtask.id}
                                  className="flex flex-col py-0.5 pl-5"
                                  variants={subtaskVariants}
                                  initial="hidden"
                                  animate="visible"
                                  layout
                                  onClick={() => subtask.description && toggleSubtask(task.id, subtask.id)}
                                >
                                  <motion.div
                                    className="flex items-center rounded-md px-1 py-0.5"
                                    whileHover={{ backgroundColor: "rgba(128,128,128,0.06)", transition: { duration: 0.2 } }}
                                    layout
                                  >
                                    <div className="mr-2 shrink-0">
                                      <StatusIcon status={subtask.status} size="sm" />
                                    </div>
                                    <span
                                      className={`text-[11px] ${
                                        subtask.status === "completed"
                                          ? "text-muted-foreground/60 line-through"
                                          : subtask.status === "in-progress"
                                          ? "text-foreground"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {subtask.title}
                                    </span>
                                  </motion.div>

                                  <AnimatePresence>
                                    {isSubExpanded && subtask.description && (
                                      <motion.div
                                        className="ml-1.5 mt-0.5 border-l border-dashed border-foreground/15 pl-4 text-[10px] text-muted-foreground overflow-hidden"
                                        variants={subtaskDetailsVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                      >
                                        <p className="py-1">{subtask.description}</p>
                                        {subtask.tools && subtask.tools.length > 0 && (
                                          <div className="mb-1 flex flex-wrap items-center gap-1.5">
                                            <span className="font-medium text-muted-foreground">Tools:</span>
                                            {subtask.tools.map((tool, idx) => (
                                              <motion.span
                                                key={idx}
                                                className="rounded bg-secondary/40 px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.04 } }}
                                              >
                                                {tool}
                                              </motion.span>
                                            ))}
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                              )
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                )
              })}
            </ul>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  )
}
