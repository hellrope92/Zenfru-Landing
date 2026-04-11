"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type VoiceWidgetContainerProps = {
  agentId: string
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

function WidgetEmbed({ agentId }: { agentId: string }) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false

    const mountWidget = async () => {
      if (!hostRef.current || !agentId) {
        return
      }

      await ensureConvaiScript()
      if (cancelled || !hostRef.current) {
        return
      }

      // Enforce a single widget instance inside this host.
      hostRef.current.innerHTML = ""
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
      hostRef.current.appendChild(widget)
    }

    mountWidget().catch(() => {
      if (hostRef.current) {
        hostRef.current.innerHTML = '<div class="p-3 text-sm text-red-600">Unable to load voice widget. Please retry.</div>'
      }
    })

    return () => {
      cancelled = true
      if (hostRef.current) {
        hostRef.current.innerHTML = ""
      }
    }
  }, [agentId])

  return <div ref={hostRef} className="relative h-full w-full overflow-hidden bg-slate-50" />
}

export default function VoiceWidgetContainer({ agentId }: VoiceWidgetContainerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const openPanel = useCallback(() => {
    clearCloseTimer()
    setIsOpen(true)
    setIsMounted(true)
    requestAnimationFrame(() => setIsVisible(true))
  }, [clearCloseTimer])

  const closePanel = useCallback(() => {
    clearCloseTimer()
    setIsOpen(false)
    setIsVisible(false)
    closeTimerRef.current = window.setTimeout(() => {
      setIsMounted(false)
    }, ANIMATION_MS)
  }, [clearCloseTimer])

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

  return (
    <>
      <button
        type="button"
        onClick={togglePanel}
        aria-expanded={isOpen}
        aria-controls="voice-widget-panel"
        className="fixed bottom-6 right-6 z-[110] rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {isOpen ? "Hide Call" : "Call"}
      </button>

      {isMounted && (
        <div
          id="voice-widget-panel"
          className={`fixed bottom-20 right-4 z-[120] w-[320px] max-w-[calc(100vw-2rem)] h-[480px] max-h-[calc(100vh-6rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDuration: `${ANIMATION_MS}ms` }}
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
            <p className="text-sm font-semibold text-slate-700">Voice Assistant</p>
            <button
              type="button"
              onClick={closePanel}
              className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
          <div className="h-[calc(100%-41px)] w-full overflow-hidden">
            <WidgetEmbed agentId={agentId} />
          </div>
        </div>
      )}
    </>
  )
}
