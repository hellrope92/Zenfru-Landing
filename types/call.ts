export interface CallData {
  _id?: string;
  callId: string;
  duration: number;
  status: string;
  startTime: string | Date;
  endTime: string | Date;
  transcript: string;
  audioUrl: string;
  metadata: {
    from: string;
    to: string;
    direction: string;
    rawData: any;
  };
  createdAt: Date;
  userId?: string | null;
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
