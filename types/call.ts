export interface TranscriptMessage {
  role: "agent" | "user";
  message: string;
  tool_calls: any;
  tool_results: any;
  feedback: any;
  time_in_call_secs: number;
  conversation_turn_metrics: any;
}

export interface CallData {
  _id?: string;
  conversationId: string;
  agentId: string;
  userId: string;
  elevenLabsUserId?: string;
  status: string;
  callerName: string;
  callerNumber: string;
  callType: "inbound" | "outbound";
  callAttempt: number;
  callPurpose: string;
  callOutcome?: "Booked" | "Engaged" | "Call Back" | string;
  transcript: TranscriptMessage[];
  metadata: {
    startTime: Date;
    duration: number;
    cost: number;
    terminationReason: string;
    feedback: {
      overall_score: number | null;
      likes: number;
      dislikes: number;
    };
  };
  analysis: {
    callSuccessful: string;
    summary: string;
    evaluationResults: any;
    dataCollectionResults: any;
  };
  conversationInitiationData: any;
  eventTimestamp: Date;
  createdAt: Date;
  hasAudio: boolean;
  audioBase64?: string;
  audioUrl?: string | null;
  audioReceivedAt?: Date;
}

export interface CallAnalytics {
  totalCalls: number;
  totalDuration: number;
  averageDuration: number;
  callsByStatus: {
    completed: number;
    missed: number;
    failed: number;
  };
  recentCalls: CallData[];
}
