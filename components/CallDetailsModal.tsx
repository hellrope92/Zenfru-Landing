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
    return d.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get caller name from first user message or use default
  const callerName = call.conversationInitiationData?.dynamic_variables?.user_name || "Customer";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div 
        ref={modalRef}
        className="bg-white h-full w-full max-w-2xl shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-lg">
                {callerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{callerName}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Call Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Call Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-gray-400">📞</span>
                <span className="text-gray-900">{call.conversationId}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-gray-400">📅</span>
                <span className="text-gray-900">{formatDate(call.metadata.startTime)}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-gray-400">🕐</span>
                <span className="text-gray-900">{formatTime(call.metadata.startTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Duration</span>
                <span className="text-sm text-gray-900 font-medium">
                  {formatDuration(call.metadata.duration)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolution</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  call.analysis?.callSuccessful === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {call.analysis?.callSuccessful || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Recording */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-purple-600">🔊</span>
              <h3 className="text-sm font-medium text-gray-900">Audio Recording</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              {call.hasAudio && call.audioBase64 ? (
                <audio 
                  controls 
                  className="w-full"
                  src={`data:audio/mp3;base64,${call.audioBase64}`}
                >
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">Audio playback (demo placeholder)</p>
                  <audio controls className="w-full mt-2">
                    <source src="/zenfru-demo.mp3" type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>

          {/* Message Transcript */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-purple-600">📄</span>
              <h3 className="text-sm font-medium text-gray-900">Message Transcript</h3>
            </div>
            <div className="space-y-4">
              {call.transcript && call.transcript.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'agent' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${
                    message.role === 'agent' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  } rounded-2xl px-4 py-3`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs opacity-75">
                        {message.role === 'agent' ? '🤖 AI Agent' : `👤 ${callerName}`}
                      </span>
                      <span className="text-xs opacity-75">
                        {Math.floor(message.time_in_call_secs / 60)}:{(message.time_in_call_secs % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          {call.analysis?.summary && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-purple-600">✨</span>
                <h3 className="text-sm font-medium text-gray-900">AI Summary</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {call.analysis.summary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CallDetailsModal;
