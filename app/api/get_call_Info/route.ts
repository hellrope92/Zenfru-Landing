import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extract call data from ElevenLabs webhook
    const callData = {
      callId: body.call_id || body.id,
      duration: body.duration,
      status: body.status,
      startTime: body.start_time || body.started_at,
      endTime: body.end_time || body.ended_at,
      transcript: body.transcript,
      audioUrl: body.recording_url || body.audio_url,
      metadata: {
        from: body.from || body.caller,
        to: body.to || body.callee,
        direction: body.direction,
        rawData: body
      },
      createdAt: new Date(),
      userId: body.user_id || null
    };

    // Connect to MongoDB and save call data
    const client = await clientPromise;
    const db = client.db();
    
    const result = await db.collection("calls").insertOne(callData);

    console.log("Call data saved:", result.insertedId);

    return NextResponse.json(
      { 
        success: true, 
        message: "Call data received and stored",
        callId: result.insertedId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process webhook data" 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: "ElevenLabs webhook endpoint is active" },
    { status: 200 }
  );
}
