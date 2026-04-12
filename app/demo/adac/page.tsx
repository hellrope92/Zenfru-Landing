"use client"

import { useState } from "react"
import DemoLayout, { DemoStatus } from "@/components/DemoLayout"
import VoiceWidgetContainer from "@/components/VoiceWidgetContainer"

export default function AdacPage() {
  const [status, setStatus] = useState<DemoStatus>("ready")
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "agent_4101kjx2evbde6dbtn030m0zwj11"

  return (
    <DemoLayout status={status}>
      <VoiceWidgetContainer agentId={agentId} onStatusChange={setStatus} />
    </DemoLayout>
  )
}
