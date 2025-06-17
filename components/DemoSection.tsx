"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, XCircle } from 'lucide-react';

interface TranscriptionItem {
  time: number;
  duration: number;
  type: 'ai' | 'human' | 'tool' | 'system';
  speaker: string;
  text: string;
  toolResult?: string | object;
}

interface DemoSectionProps {
  onBack: () => void;
}

// A persistent button to stop the demo
const StopDemoButton = ({ onStop }: { onStop: () => void }) => (
  <button
    onClick={onStop}
    className="fixed top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 z-50 bg-black/40 backdrop-blur-sm rounded-lg px-4 py-3 shadow-2xl border border-white/20 mt-16 hover:bg-black/60"
  >
    <XCircle className="w-5 h-5" />
    <span className="font-medium">Stop Demo</span>
  </button>
);

export default function DemoSection({ onBack }: DemoSectionProps) {
  const [phase, setPhase] = useState<'intro' | 'patient-calling' | 'clinic-closed' | 'agent-picks-up' | 'conversation'>('intro');
  const [currentTime, setCurrentTime] = useState(0);
  const [transcription, setTranscription] = useState<TranscriptionItem[]>([]);
  const [currentDialogue, setCurrentDialogue] = useState<TranscriptionItem | null>(null);
  const [dialogueHistory, setDialogueHistory] = useState<TranscriptionItem[]>([]);
  const [nextDialogueIndex, setNextDialogueIndex] = useState(0);
  const [demoTimer, setDemoTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const conversationContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleStopDemo = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsTimerRunning(false);
    setDemoTimer(0);
    setCurrentDialogue(null);
    setDialogueHistory([]);
    setNextDialogueIndex(0);
    onBack();
  };
  const handleStartDemo = async () => {
    const audio = audioRef.current;
    if (audio) {
      // This is the key fix: We play and immediately pause the audio inside a
      // user-triggered event. This "primes" the audio element, and the browser
      // will now allow it to be played programmatically later.
      try {
        await audio.play();
        audio.pause();
        audio.currentTime = 0;
      } catch (error) {
        console.error("Audio priming failed:", error);
        alert("Could not initialize audio. Please check your browser settings and permissions.");
        return;
      }
    }
    // With audio primed, we can now start the rest of the demo sequence.
    setPhase('patient-calling');
  };

  // Start the demo timer when conversation phase begins
  const startDemoTimer = () => {
    setIsTimerRunning(true);
    setDemoTimer(0);
    
    timerRef.current = setInterval(() => {
      setDemoTimer(prev => {
        const newTime = prev + 0.1; // Update every 100ms for smooth progression
        
        // Stop timer when demo ends (2 min 22 sec = 142 seconds)
        if (newTime >= 142) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsTimerRunning(false);
          return 142;
        }
        
        return newTime;
      });
    }, 100); // Update every 100ms
  };  // Load transcription data
  useEffect(() => {
    fetch('/demo-transcription.json')
      .then(res => res.json())
      .then(data => {
        // Handle both old format {transcription: [...]} and new format [...]
        const transcriptionData = Array.isArray(data) ? data : data.transcription;
        setTranscription(transcriptionData);
        console.log('Loaded transcription:', transcriptionData); // Debug log
      })
      .catch(error => {
        console.error('Failed to load transcription:', error);
      });
  }, []);
  // Phase transitions
  useEffect(() => {
    let timer: NodeJS.Timeout;
    // The 'intro' phase now waits for user input via the "Start Demo" button.
    if (phase === 'patient-calling') {
      timer = setTimeout(() => setPhase('clinic-closed'), 2000);
    } else if (phase === 'clinic-closed') {
      timer = setTimeout(() => setPhase('agent-picks-up'), 2000);
    } else if (phase === 'agent-picks-up') {
      timer = setTimeout(() => {
        setPhase('conversation');
        startDemoTimer(); // Start the demo timer when conversation begins
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [phase]);
    // Effect to play audio once the conversation phase begins
  useEffect(() => {
    if (phase === 'conversation' && audioRef.current?.paused) {
      audioRef.current.play().catch(error => {
        console.error("Conversation audio playback failed:", error);
      });
    }
  }, [phase]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);  // Timer-based dialogue progression
  useEffect(() => {
    if (!transcription || transcription.length === 0 || phase !== 'conversation' || !isTimerRunning) return;

    // Find the next dialogue that should be shown based on current timer
    const nextDialogue = transcription.find((item, index) => {
      return index >= nextDialogueIndex && demoTimer >= item.time;
    });

    if (nextDialogue && nextDialogue !== currentDialogue) {
      // Move current dialogue to history if it exists (add to beginning for newest-first order)
      if (currentDialogue) {
        setDialogueHistory(prev => [currentDialogue, ...prev]);
      }
      
      // Set new current dialogue
      setCurrentDialogue(nextDialogue);
      
      // Update the index for next dialogue
      const newIndex = transcription.findIndex(item => item === nextDialogue) + 1;
      setNextDialogueIndex(newIndex);
    }
  }, [demoTimer, transcription, phase, isTimerRunning, currentDialogue, nextDialogueIndex]);  // Auto-scroll to new dialogue (scroll to top for newest-first order)
  useEffect(() => {
    if (conversationContainerRef.current && currentDialogue) {
      setTimeout(() => {
        conversationContainerRef.current?.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [currentDialogue]);
  const getDisplayText = (item: TranscriptionItem) => {
    if (item.type === 'tool' && item.toolResult) {
      // Handle new JSON format where toolResult is an object
      if (typeof item.toolResult === 'string') {
        return item.toolResult;
      } else if (typeof item.toolResult === 'object') {
        // Format the tool result object nicely
        return JSON.stringify(item.toolResult, null, 2);
      }
    }
    return item.text;
  };

  const getDisplaySpeaker = (item: TranscriptionItem) => {
    if (item.type === 'ai') return 'Zenfru'; // Changed from Arini to Zenfru
    if (item.type === 'human') return 'Patient';
    return item.speaker;
  };  // Common layout for pre-conversation phases
  const DemoLayout = ({ children }: { children: React.ReactNode }) => (
    <section className="min-h-screen bg-sky-100 text-slate-800 flex items-center justify-center relative p-6">
      <button
        onClick={handleStopDemo}
        className="fixed top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors duration-200 z-50 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-slate-200 mt-16"
      >
        <XCircle className="w-5 h-5" />
        <span className="font-medium">Stop Demo</span>
      </button>
      <div className="text-center max-w-3xl mx-auto animate-demo-slide-in">
        {children}
      </div>
      <audio ref={audioRef} src="/zenfru-demo.mp3" preload="auto" />
    </section>
  );
  if (phase === 'intro') {     return (
      <DemoLayout>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">This is an audio demo for</h1>
        <h2 className="text-4xl md:text-5xl font-bold text-blue-600 mb-8">BrightSmile Dental Clinic</h2>
        <p className="text-xl text-slate-600 mb-10">Click the button below to start the interactive call.</p>
        <button
          onClick={handleStartDemo}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-xl"
        >
          ▶ Start Interactive Demo
        </button>
      </DemoLayout>
    );
  }

  if (phase === 'patient-calling' || phase === 'clinic-closed' || phase === 'agent-picks-up') {
    let icon, title;    switch (phase) {
      case 'patient-calling':
        icon = <div className="w-20 h-20 bg-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"><Phone className="w-10 h-10" /></div>;
        title = <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Patient calls...</h1>;
        break;
      case 'clinic-closed':
        icon = <div className="w-20 h-20 bg-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6"><PhoneOff className="w-10 h-10" /></div>;
        title = <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Clinic is closed</h1>;
        break;
      case 'agent-picks-up':
        icon = <div className="w-20 h-20 bg-blue-200 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"><Phone className="w-10 h-10" /></div>;
        title = <>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Instead of voicemail</h1>
          <h2 className="text-2xl md:text-3xl text-blue-700">Our agent picks it up</h2>
        </>;
        break;
    }
    return <DemoLayout>{icon}{title}</DemoLayout>;  }  // Conversation Phase
  return (
    <section className="min-h-screen bg-sky-100 text-slate-800 flex flex-col relative mt-12">
      {/* Top bar with stop demo and online indicator */}
      <div className="fixed top-6 left-6 right-6 flex justify-between items-center z-50 mt-16">
        <button
          onClick={handleStopDemo}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors duration-200 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-slate-200 hover:bg-white"
        >
          <XCircle className="w-5 h-5" />
          <span className="font-medium">Stop Demo</span>
        </button>
        
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-slate-200">
          <div className="flex items-center gap-1">
            <div className="w-2 h-4 bg-green-400 rounded-sm animate-pulse"></div>
            <div className="w-2 h-3 bg-green-400 rounded-sm animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-5 bg-green-400 rounded-sm animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-green-600 font-medium text-sm">Online</span>
          {/* <div className="text-slate-400 text-sm font-mono ml-2">
            {Math.floor(demoTimer / 60)}:{(demoTimer % 60).toFixed(1).padStart(4, '0')}
          </div> */}
        </div>
      </div>
      
      <div ref={conversationContainerRef} className="flex-grow overflow-y-auto px-6 pb-32 pt-24">
        <div className="space-y-8 max-w-4xl mx-auto">{/* Current dialogue shown first (newest at top) */}
          {currentDialogue && (
            <div className="animate-demo-slide-in scale-100 opacity-100 transition-all duration-700" key={`current-${nextDialogueIndex}`}>
              {(() => {
                const isAI = currentDialogue.type === 'ai' || (currentDialogue.type === 'tool' && currentDialogue.toolResult);
                const isPatient = currentDialogue.type === 'human';
                const isTool = currentDialogue.type === 'tool';
                const isSystem = currentDialogue.speaker === 'system' || currentDialogue.type === 'system';
                  if (isTool && !currentDialogue.toolResult) {
                  // Tool processing indicator - centered box (not dialogue)
                  return (
                    <div className="flex justify-center mb-6">
                      <div className="bg-gradient-to-r from-amber-100 to-yellow-50 border-2 border-amber-300 rounded-2xl p-6 max-w-md shadow-xl">
                        <div className="flex items-center justify-center gap-4 text-amber-800">
                          <div className="relative">
                            <div className="w-6 h-6 bg-amber-400 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 w-6 h-6 bg-amber-500 rounded-full animate-tool-processing"></div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-lg mb-1">⚡ Processing Tool</div>
                            <div className="text-amber-700 text-sm">{currentDialogue.text}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );                } else if (isSystem) {
                  // System message - styled chatbox in center
                  return (
                    <div className="flex justify-center mb-6">
                      <div className="bg-white border-2 border-indigo-300 rounded-2xl p-6 max-w-lg shadow-2xl relative overflow-hidden">
                        {/* Decorative gradient border effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl"></div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-center justify-center gap-3 mb-4">
                          
                            <div className="text-indigo-700 font-bold text-lg">⚙️ System</div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
                            <div className="text-slate-800 text-center font-medium leading-relaxed">
                              {getDisplayText(currentDialogue)}
                            </div>
                          </div>
                          
                          {/* Bottom accent line */}
                          <div className="mt-4 flex justify-center">
                            <div className="w-16 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );} else if (isAI) {
                  // AI message - aligned right with light theme styling
                  return (
                    <div className="flex justify-end">
                      <div className="max-w-2xl">
                        <div className="flex items-center justify-end gap-2 mb-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-blue-700 font-semibold text-sm">{getDisplaySpeaker(currentDialogue)}</span>
                        </div>
                        <div className="bg-blue-100 rounded-2xl rounded-tr-sm p-5 shadow-lg border border-blue-200">
                          <p className="text-slate-900 text-lg leading-relaxed">{getDisplayText(currentDialogue)}</p>
                        </div>
                        {/* Show tool/processing info for AI responses */}
                        {(currentDialogue as any).processing && (
                          <div className="mt-3 text-right">
                            <div className="inline-flex flex-wrap gap-2 justify-end">
                              {(currentDialogue as any).processing.map((proc: any, idx: number) => (
                                <span key={idx} className="text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full border border-blue-300">
                                  {proc.type}: {proc.duration}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else if (isPatient) {
                  // Patient message - aligned left with light theme styling
                  return (
                    <div className="flex justify-start">
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-700 font-semibold text-sm">{getDisplaySpeaker(currentDialogue)}</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <div className="bg-green-100 rounded-2xl rounded-tl-sm p-5 shadow-lg border border-green-200">
                          <p className="text-slate-900 text-lg leading-relaxed">{getDisplayText(currentDialogue)}</p>
                        </div>
                      </div>
                    </div>
                  );                } else if (isTool && currentDialogue.toolResult) {
                  // Tool with result - centered box (not dialogue)
                  return (
                    <div className="flex justify-center mb-6">
                      <div className="max-w-2xl w-full">
                        <div className="text-center mb-3">
                          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full border border-amber-300">
                            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                            <span className="text-amber-800 font-bold text-sm">🔧 Tool Result</span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-xl border-2 border-amber-200">
                          <div className="text-center">
                            <pre className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-mono bg-white/80 p-4 rounded-xl border border-amber-200 shadow-inner">
                              {getDisplayText(currentDialogue)}
                            </pre>
                          </div>
                        </div>
                        {/* Enhanced tool execution info */}
                        <div className="mt-4 text-center">
                          <div className="inline-flex flex-wrap gap-2 justify-center">
                            <span className="text-xs bg-amber-200 text-amber-800 px-3 py-1 rounded-full border border-amber-300 font-mono">
                              ⚡ {currentDialogue.text}
                            </span>
                            {(currentDialogue as any).processing && (currentDialogue as any).processing.map((proc: any, idx: number) => (
                              <span key={idx} className="text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full border border-blue-300 font-mono">
                                {proc.type}: {proc.duration}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}          {/* Historical dialogues (older messages below) */}
          {dialogueHistory.map((item, index) => {
            const isAI = item.type === 'ai' || (item.type === 'tool' && item.toolResult);
            const isPatient = item.type === 'human';
            const isTool = item.type === 'tool';
            const isSystem = item.speaker === 'system' || item.type === 'tool';
            
            return (
              <div key={`history-${index}`} className="opacity-40 scale-95 transition-all duration-500">
                {isTool && !item.toolResult ? (
                  // Tool processing indicator - centered box
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-25 border border-amber-200 rounded-2xl p-4 max-w-md">
                      <div className="flex items-center justify-center gap-3 text-amber-600">
                        <div className="w-4 h-4 bg-amber-400 rounded-full opacity-50"></div>
                        <div className="text-center">
                          <div className="font-medium text-sm">⚡ Processing Tool</div>
                          <div className="text-amber-500 text-xs">{item.text}</div>
                        </div>
                      </div>
                    </div>
                  </div>                ) : isSystem ? (
                  // System message - styled chatbox (historical)
                  <div className="flex justify-center">
                    <div className="bg-white/70 border border-indigo-200 rounded-2xl p-4 max-w-lg shadow-lg relative overflow-hidden">
                      {/* Subtle decorative effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl"></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          
                          <div className="text-indigo-600 font-semibold text-sm">⚙️ System</div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-indigo-25 to-purple-25 border border-indigo-100 rounded-lg p-3">
                          <div className="text-slate-600 text-center text-sm leading-relaxed">
                            {getDisplayText(item)}
                          </div>
                        </div>
                        
                        {/* Bottom accent line */}
                        <div className="mt-3 flex justify-center">
                          <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-50"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : isAI ? (
                  // AI message - aligned right
                  <div className="flex justify-end">
                    <div className="max-w-2xl">
                      <div className="flex items-center justify-end gap-2 mb-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50"></div>
                        <span className="text-blue-500 font-medium text-xs">{getDisplaySpeaker(item)}</span>
                      </div>
                      <div className="bg-blue-50 rounded-2xl rounded-tr-sm p-4 border border-blue-200">
                        <p className="text-slate-600 text-base leading-relaxed">{getDisplayText(item)}</p>
                      </div>
                    </div>
                  </div>
                ) : isPatient ? (
                  // Patient message - aligned left
                  <div className="flex justify-start">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-green-500 font-medium text-xs">{getDisplaySpeaker(item)}</span>
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-50"></div>
                      </div>
                      <div className="bg-green-50 rounded-2xl rounded-tl-sm p-4 border border-green-200">
                        <p className="text-slate-600 text-base leading-relaxed">{getDisplayText(item)}</p>
                      </div>
                    </div>
                  </div>
                ) : isTool && item.toolResult ? (
                  // Tool with result - centered box
                  <div className="flex justify-center">
                    <div className="max-w-2xl w-full">
                      <div className="text-center mb-2">
                        <div className="inline-flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                          <div className="w-2 h-2 bg-amber-400 rounded-full opacity-50"></div>
                          <span className="text-amber-600 font-medium text-xs">🔧 Tool Result</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-amber-25 to-orange-25 rounded-2xl p-4 border border-amber-200">
                        <div className="text-center">
                          <pre className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-mono bg-white/60 p-3 rounded-lg border border-amber-100">
                            {getDisplayText(item)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      
      <audio ref={audioRef} src="/zenfru-demo.mp3" preload="auto" />
    </section>
  );
}