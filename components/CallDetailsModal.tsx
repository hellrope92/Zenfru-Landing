"use client";

import { CallData } from "@/types/call";
import { useEffect, useRef } from "react";

interface CallDetailsModalProps {
  call: CallData;
  onClose: () => void;
}

function CallDetailsModal({ call, onClose }: CallDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "Unknown date";
    return d.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "--:--";
    return d.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (seconds: number | string | undefined) => {
    const safeSeconds = Number(seconds || 0);
    if (Number.isNaN(safeSeconds) || safeSeconds < 0) return "0:00";
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get caller name from first user message or use default
  const callerName = call.conversationInitiationData?.dynamic_variables?.user_name || "Customer";
  const callerPhone =
    call.callerNumber ||
    call.conversationInitiationData?.dynamic_variables?.phone_number ||
    "Unknown number";
  const transcript = (call.transcript || []).filter(
    (message) => message.message && message.message.trim() !== ""
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-[1px] p-3 sm:p-6 flex items-center justify-center">
      <div 
        ref={modalRef}
        className="bg-white h-full max-h-[95vh] w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center ring-1 ring-sky-200">
              <span className="text-sky-700 font-semibold text-lg">
                {callerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{callerName}</h2>
              <p className="text-xs text-slate-500">Conversation Details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close call details"
            className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-5 bg-gradient-to-b from-white to-slate-50/40">
          {/* Call Information */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-500 mb-4">Call Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-slate-600">Phone</span>
                <span className="text-slate-600 truncate">{callerPhone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-slate-600">Date</span>
                <span className="text-slate-600">{formatDate(call.metadata?.startTime || call.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-slate-600">Time</span>
                <span className="text-slate-600">{formatTime(call.metadata?.startTime || call.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-sm text-slate-600">Duration</span>
                <span className="text-sm text-slate-600 font-medium">
                  {formatDuration(call.metadata?.duration)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-sm text-slate-600">Resolution</span>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                  {call.analysis?.callSuccessful || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Recording */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-sm font-semibold text-slate-900">Audio</h3>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              {call.hasAudio && call.audioBase64 ? (
                <audio 
                  controls 
                  className="w-full"
                  src={`data:audio/mp3;base64,${call.audioBase64}`}
                >
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div className="text-center py-2">
                  <audio controls className="w-full mt-2">
                    <source src="/zenfru-demo.mp3" type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>

          {/* AI Summary */}
          {call.analysis?.summary && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sky-600 text-sm font-semibold">INSIGHT</span>
                <h3 className="text-sm font-semibold text-slate-900">AI Summary</h3>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {call.analysis.summary}
                </p>
              </div>
            </div>
          )}

          {/* Transcript */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Transcript</h3>
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
              {transcript.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  No transcript was captured for this conversation.
                </div>
              )}
              {transcript.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${
                    message.role === 'agent' 
                      ? 'bg-sky-700 text-white' 
                      : 'bg-slate-100 text-slate-900'
                  } rounded-2xl px-4 py-3`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs opacity-75">
                        {message.role === 'agent' ? 'AI Agent' : callerName}
                      </span>
                      <span className="text-xs opacity-75">
                        {formatDuration(message.time_in_call_secs)}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallDetailsModal;
