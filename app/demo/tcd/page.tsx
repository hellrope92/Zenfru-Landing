"use client"

import { useEffect } from "react"
import Script from "next/script"
import Link from "next/link"
import Image from "next/image"

export default function TcdPage() {
  useEffect(() => {
    // Widget will use its natural overlay positioning from ElevenLabs config
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="Zenfru Logo"
                    width={108}
                    height={32}
                    className="rounded-xl"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-8">
                <Link href="/#features" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Features
                </Link>
                <Link href="/#integration" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Integration
                </Link>
                <Link href="/#results" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Results
                </Link>
                <Link href="/#faq" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  FAQ
                </Link>
                <Link href="/support" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Support
                </Link>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-3">
              <Link
                href="https://calendly.com/kay-zenfru"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-blue-600 text-blue-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Book Call
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-3xl">
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-slate-200/50 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100 via-indigo-100 to-transparent rounded-full -translate-y-20 translate-x-20 opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100 to-transparent rounded-full translate-y-16 -translate-x-16 opacity-40"></div>

              <div className="relative">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4 border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live After-Hours Demo</span>
                  </div>
                  <h3 className="text-3xl font-black mb-3 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Try Our AI Receptionist
                  </h3>
                  <p className="text-slate-600 font-medium">
                    Experience how patients interact with your after-hours assistant
                  </p>
                </div>

                {/* AI Agent Widget - Renders as floating overlay */}
                <div dangerouslySetInnerHTML={{ __html: '<elevenlabs-convai agent-id="agent_4001kd28mf87fn7vd7swe27z6gj8"></elevenlabs-convai>' }} />

                {/* Sample Conversation Examples */}
                <div className="space-y-4">
                  <div className="text-sm text-slate-500 font-bold uppercase tracking-wide">
                    Common After-Hours Requests:
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
                      <div className="text-sm font-bold text-slate-800">
                        "I need to book a cleaning for next week"
                      </div>
                      <div className="text-xs text-slate-600 mt-1 font-medium">
                        → Checks availability & books instantly
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                      <div className="text-sm font-bold text-slate-800">
                        "Can I reschedule my appointment tomorrow?"
                      </div>
                      <div className="text-xs text-slate-600 mt-1 font-medium">
                        → Finds new slot & confirms change
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
                      <div className="text-sm font-bold text-slate-800">
                        "What are your office hours and location?"
                      </div>
                      <div className="text-xs text-slate-600 mt-1 font-medium">
                        → Provides accurate practice info
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" async type="text/javascript" />
    </div>
  )
}
