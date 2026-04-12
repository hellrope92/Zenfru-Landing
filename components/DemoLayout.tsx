"use client"

import Link from "next/link"
import Image from "next/image"
import { ReactNode } from "react"

export type DemoStatus = "ready" | "calling" | "processing"

type DemoLayoutProps = {
  status: DemoStatus
  children: ReactNode
}

const STATUS_STYLES: Record<DemoStatus, { label: string; dot: string; chip: string }> = {
  ready: {
    label: "Ready",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  calling: {
    label: "Calling",
    dot: "bg-blue-500",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
  },
  processing: {
    label: "Processing",
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
  },
}

export default function DemoLayout({ status, children }: DemoLayoutProps) {
  const statusStyle = STATUS_STYLES[status]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo.png" alt="Zenfru Logo" width={108} height={32} className="rounded-xl" />
          </Link>
          <p className="text-sm font-semibold text-slate-600">Outbound Calling Demo</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
        <section className="w-full lg:w-2/3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live Product Flow
          </div>

          <h1 className="text-2xl lg:text-4xl font-semibold tracking-tight text-slate-900">Grand Dental Scheduler</h1>
          <p className="mt-3 text-sm lg:text-base text-slate-600">
            Automate patient outreach, fill open slots, and book appointments without manual follow-ups.
          </p>

          <div className={`mt-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${statusStyle.chip}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${statusStyle.dot}`} />
            <span>Live Status: {statusStyle.label}</span>
          </div>

          <ul className="mt-6 space-y-3 text-sm text-slate-700 sm:text-base">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
              <span>Calls overdue patients automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
              <span>Finds open slots in the next 72 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
              <span>Books appointments instantly during the call</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate-900" />
              <span>Sends SMS fallback when patients miss a call</span>
            </li>
          </ul>
        </section>

        <section className="w-full lg:w-1/3 flex items-start justify-center lg:justify-end">{children}</section>
        </div>
      </main>
    </div>
  )
}
