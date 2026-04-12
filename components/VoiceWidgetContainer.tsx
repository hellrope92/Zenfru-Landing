"use client"

import Script from "next/script"
import React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { DemoStatus } from "@/components/DemoLayout"

type VoiceWidgetContainerProps = {
  agentId: string
  onStatusChange?: (status: DemoStatus) => void
}

const CONVAI_SCRIPT_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed"
const ANIMATION_MS = 240

export default function VoiceWidgetContainer({ agentId, onStatusChange }: VoiceWidgetContainerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasError, setHasError] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const openPanel = useCallback(() => {
    clearCloseTimer()
    setHasError(false)
    setIsOpen(true)
    setIsMounted(true)
    onStatusChange?.("processing")
    requestAnimationFrame(() => setIsVisible(true))
  }, [clearCloseTimer, onStatusChange])

  const closePanel = useCallback(() => {
    clearCloseTimer()
    setIsOpen(false)
    setIsVisible(false)
    onStatusChange?.("ready")
    closeTimerRef.current = window.setTimeout(() => {
      setIsMounted(false)
    }, ANIMATION_MS)
  }, [clearCloseTimer, onStatusChange])

  const togglePanel = useCallback(() => {
    if (isOpen) {
      closePanel()
    } else {
      openPanel()
    }
  }, [closePanel, isOpen, openPanel])

  useEffect(() => {
    return () => {
      clearCloseTimer()
    }
  }, [clearCloseTimer])

  useEffect(() => {
    if (!isOpen) {
      onStatusChange?.("ready")
    }
  }, [isOpen, onStatusChange])

  const handleWidgetReady = useCallback(() => {
    onStatusChange?.("calling")
  }, [onStatusChange])

  useEffect(() => {
    if (!isMounted || !isVisible) {
      return
    }

    const timer = window.setTimeout(() => {
      setHasError(false)
      handleWidgetReady()
    }, 400)

    return () => window.clearTimeout(timer)
  }, [handleWidgetReady, isMounted, isVisible])

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:p-4">
      <div className="mb-4 flex justify-between items-center border-b border-slate-200 pb-2">
        <p className="text-sm font-semibold text-slate-800">Outbound calling demo</p>
        <button
          type="button"
          onClick={togglePanel}
          aria-expanded={isOpen}
          aria-controls="voice-widget-panel"
          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          {isOpen ? "Stop Demo" : "Start Call Demo"}
        </button>
      </div>

      <div
        className={`voice-widget-container ${isMounted ? "voice-widget-container-mounted" : "voice-widget-container-idle"} w-full max-w-sm mx-auto overflow-hidden rounded-xl shadow-lg border border-slate-200 bg-slate-50`}
      >
        {!isMounted && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <p className="text-sm font-semibold text-slate-800">AI Outbound Call Preview</p>
            <p className="mt-2 text-xs text-slate-600">Press Start Call Demo to launch the live calling widget.</p>
          </div>
        )}

        {isMounted && (
          <div
            id="voice-widget-panel"
            className={`h-full w-full transition-all ${isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
            style={{ transitionDuration: `${ANIMATION_MS}ms` }}
          >
            <Script src={CONVAI_SCRIPT_SRC} async type="text/javascript" strategy="afterInteractive" />
            {hasError ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="text-sm font-semibold text-red-700">Widget failed to load</p>
                <p className="mt-2 text-xs text-slate-600">Try Start Call Demo again.</p>
              </div>
            ) : (
              <div className="voice-widget-host relative h-full w-full overflow-hidden">
                {React.createElement("elevenlabs-convai", { "agent-id": agentId })}
                <div className="voice-widget-input-mask" aria-hidden="true" />
              </div>
            )}
          </div>
        )}
      </div>

      {isMounted && (
        <div
          className={`mt-2 text-center text-[11px] text-slate-500 transition-opacity ${isVisible ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDuration: `${ANIMATION_MS}ms` }}
        >
          Demo call is active. Booking outcomes and SMS fallback are tracked in real time.
        </div>
      )}

      <style jsx global>{`
        elevenlabs-convai {
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          min-height: 100% !important;
          display: block;
        }

        /* Prefer external panel title and hide the vendor default help title. */
        elevenlabs-convai::part(header-title),
        elevenlabs-convai::part(title) {
          display: none !important;
        }

        /* Demo mode: hide text-chat composer/input row to keep voice-only experience. */
        elevenlabs-convai::part(composer),
        elevenlabs-convai::part(chat-input),
        elevenlabs-convai::part(text-input),
        elevenlabs-convai::part(input),
        elevenlabs-convai::part(send-button),
        elevenlabs-convai::part(message-input) {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          min-height: 0 !important;
          max-height: 0 !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: hidden !important;
          pointer-events: none !important;
        }

        .voice-widget-container {
          width: 100%;
          max-width: 24rem;
          height: 420px;
          overflow: hidden;
        }

        .voice-widget-container-mounted {
          height: 620px;
        }

        .voice-widget-host {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .voice-widget-input-mask {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 10px;
          height: 78px;
          border-radius: 16px;
          background: #f8fafc;
          z-index: 10;
          pointer-events: none;
        }

        @media (max-width: 640px) {
          .voice-widget-container {
            width: 100%;
            max-width: 100%;
            height: 560px;
          }

          .voice-widget-input-mask {
            left: 8px;
            right: 8px;
            bottom: 8px;
            height: 74px;
          }
        }
      `}</style>
    </div>
  )
}
