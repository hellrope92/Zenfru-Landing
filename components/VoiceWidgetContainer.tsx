"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { DemoStatus } from "@/components/DemoLayout"

type VoiceWidgetContainerProps = {
  agentId: string
  onStatusChange?: (status: DemoStatus) => void
}

const CONVAI_SCRIPT_SRC = "https://unpkg.com/@elevenlabs/convai-widget-embed"
const ANIMATION_MS = 240
const INNER_WIDGET_SCALE = 0.78

let scriptReadyPromise: Promise<void> | null = null

function ensureConvaiScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve()
  }

  if (window.customElements?.get("elevenlabs-convai")) {
    return Promise.resolve()
  }

  if (scriptReadyPromise) {
    return scriptReadyPromise
  }

  scriptReadyPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${CONVAI_SCRIPT_SRC}"]`) as HTMLScriptElement | null

    if (existing) {
      const onLoad = () => resolve()
      const onError = () => reject(new Error("Failed to load ElevenLabs widget script."))
      existing.addEventListener("load", onLoad, { once: true })
      existing.addEventListener("error", onError, { once: true })

      // If the element is already available, resolve immediately.
      if (window.customElements?.get("elevenlabs-convai")) {
        resolve()
      }
      return
    }

    const script = document.createElement("script")
    script.src = CONVAI_SCRIPT_SRC
    script.async = true
    script.type = "text/javascript"
    script.addEventListener("load", () => resolve(), { once: true })
    script.addEventListener("error", () => reject(new Error("Failed to load ElevenLabs widget script.")), { once: true })
    document.body.appendChild(script)
  })

  return scriptReadyPromise
}

function WidgetEmbed({
  agentId,
  onReady,
  onError,
}: {
  agentId: string
  onReady: () => void
  onError: () => void
}) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false
    const hostNode = hostRef.current

    const mountWidget = async () => {
      if (!hostNode || !agentId) {
        return
      }

      await ensureConvaiScript()
      if (cancelled) {
        return
      }

      // Enforce a single widget instance inside this host.
      hostNode.innerHTML = ""
      const widget = document.createElement("elevenlabs-convai")
      widget.setAttribute("agent-id", agentId)
      widget.style.display = "block"
      // Keep the vendor widget at a stable size, then center and scale it
      // so the inner UI appears balanced within the fixed floating panel.
      widget.style.width = "380px"
      widget.style.height = "560px"
      widget.style.position = "absolute"
      widget.style.left = "50%"
      widget.style.top = "50%"
      widget.style.transform = `translate(-50%, -50%) scale(${INNER_WIDGET_SCALE})`
      widget.style.transformOrigin = "center center"
      hostNode.appendChild(widget)
      onReady()
    }

    mountWidget().catch(() => {
      if (hostNode) {
        hostNode.innerHTML = '<div class="p-4 text-sm text-red-600">Unable to load voice widget. Please retry.</div>'
      }
      onError()
    })

    return () => {
      cancelled = true
      if (hostNode) {
        hostNode.innerHTML = ""
      }
    }
  }, [agentId, onError, onReady])

  return <div ref={hostRef} className="relative h-full w-full overflow-hidden bg-slate-50" />
}

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

  const handleWidgetError = useCallback(() => {
    setHasError(true)
    onStatusChange?.("ready")
  }, [onStatusChange])

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl sm:p-4">
      <div className="mb-4 flex justify-between items-center border-b border-slate-200 pb-2">
        <p className="text-sm font-semibold text-slate-800">Live Call Panel</p>
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

      <div className="h-[460px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
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
            {hasError ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="text-sm font-semibold text-red-700">Widget failed to load</p>
                <p className="mt-2 text-xs text-slate-600">Try Start Call Demo again.</p>
              </div>
            ) : (
              <WidgetEmbed agentId={agentId} onReady={handleWidgetReady} onError={handleWidgetError} />
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
    </div>
  )
}
