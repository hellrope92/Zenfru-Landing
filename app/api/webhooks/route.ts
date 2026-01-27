import { NextRequest, NextResponse } from "next/server";
import clientPromise, { dbName } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'auto';

export async function POST(req: NextRequest) {
  console.log("========================================");
  console.log("WEBHOOK POST RECEIVED");
  console.log("Time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));
  console.log("========================================");
  
  try {
    
    // Log headers for debugging
    const webhookSecret = req.headers.get("x-elevenlabs-signature") || req.headers.get("authorization");
    console.log("Webhook secret received:", webhookSecret ? "Yes" : "No");
    console.log("Expected secret:", process.env.ELEVENLABS_WEBHOOK_SECRET ? "Configured" : "Not configured");
    
    // Temporarily disable secret verification for testing
    // if (process.env.ELEVENLABS_WEBHOOK_SECRET && webhookSecret !== process.env.ELEVENLABS_WEBHOOK_SECRET) {
    //   console.log("Webhook secret mismatch!");
    //   return NextResponse.json(
    //     { success: false, error: "Unauthorized" },
    //     { status: 401 }
    //   );
    // }

    const body = await req.json();
    console.log("========================================");
    console.log("WEBHOOK BODY RECEIVED");
    console.log("Type:", body.type);
    console.log("Has data:", !!body.data);
    console.log("Conversation ID:", body.data?.conversation_id);
    console.log("Full payload keys:", Object.keys(body));
    console.log("========================================");
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Handle different webhook types
    if (body.type === "post_call_transcription") {
      console.log("Processing transcription webhook...");
      
      // Map the ElevenLabs user_id to our database user
      let dbUserId = null;
      
      // Get the first user in the database as default
      const defaultUser = await db.collection("users").findOne({});
      dbUserId = defaultUser?._id.toString();
      
      console.log("Linking call to user:", defaultUser?.email);

      // Extract transcription data
      const callData = {
        conversationId: body.data.conversation_id,
        agentId: body.data.agent_id,
        userId: dbUserId, // Link to our database user
        elevenLabsUserId: body.data.user_id, // Store original ElevenLabs user_id
        status: body.data.status,
        callerName: body.data.conversation_initiation_client_data?.dynamic_variables?.user_name || "Unknown Caller",
        callerNumber: body.data.conversation_initiation_client_data?.dynamic_variables?.phone_number || "N/A",
        callType: body.data.conversation_initiation_client_data?.dynamic_variables?.call_type || "inbound",
        callAttempt: body.data.conversation_initiation_client_data?.dynamic_variables?.attempt_number || 1,
        callPurpose: body.data.conversation_initiation_client_data?.dynamic_variables?.call_purpose || "General Inquiry",
        transcript: body.data.transcript,
        metadata: {
          startTime: new Date(body.data.metadata.start_time_unix_secs * 1000),
          duration: body.data.metadata.call_duration_secs,
          cost: body.data.metadata.cost,
          terminationReason: body.data.metadata.termination_reason,
          feedback: body.data.metadata.feedback,
        },
        analysis: {
          callSuccessful: body.data.analysis.call_successful,
          summary: body.data.analysis.transcript_summary,
          evaluationResults: body.data.analysis.evaluation_criteria_results,
          dataCollectionResults: body.data.analysis.data_collection_results,
        },
        conversationInitiationData: body.data.conversation_initiation_client_data,
        eventTimestamp: new Date(body.event_timestamp * 1000),
        createdAt: new Date(),
        hasAudio: false,
        audioUrl: null,
      };

      console.log("Call data prepared:", callData);

      // Check if call already exists, update if it does
      const existingCall = await db.collection("calls").findOne({
        conversationId: body.data.conversation_id
      });

      if (existingCall) {
        await db.collection("calls").updateOne(
          { conversationId: body.data.conversation_id },
          { $set: callData }
        );
        console.log("✅ Call transcription updated:", body.data.conversation_id);
      } else {
        const result = await db.collection("calls").insertOne(callData);
        console.log("========================================");
        console.log("✅ NEW CALL INSERTED");
        console.log("Conversation ID:", body.data.conversation_id);
        console.log("Insert ID:", result.insertedId);
        console.log("User ID:", dbUserId);
        console.log("========================================");
      }

      return NextResponse.json(
        { 
          success: true, 
          message: "Transcription data received and stored",
          conversationId: body.data.conversation_id
        },
        { status: 200 }
      );

    } else if (body.type === "post_call_audio") {
      console.log("Processing audio webhook...");
      
      // Handle audio data
      const audioData = {
        audioBase64: body.data.full_audio,
        eventTimestamp: new Date(body.event_timestamp * 1000),
      };

      // Update existing call with audio
      const result = await db.collection("calls").updateOne(
        { conversationId: body.data.conversation_id },
        { 
          $set: { 
            audioBase64: audioData.audioBase64,
            hasAudio: true,
            audioReceivedAt: audioData.eventTimestamp
          } 
        }
      );

      console.log("✅ Call audio saved:", body.data.conversation_id, "Modified:", result.modifiedCount);

      return NextResponse.json(
        { 
          success: true, 
          message: "Audio data received and stored",
          conversationId: body.data.conversation_id
        },
        { status: 200 }
      );

    } else {
      // Unknown webhook type
      console.log("Unknown webhook type:", body.type);
      return NextResponse.json(
        { 
          success: false, 
          error: "Unknown webhook type" 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("========================================");
    console.error("!!! WEBHOOK ERROR !!!");
    console.error("Error:", error);
    console.error("Stack:", error instanceof Error ? error.stack : "No stack");
    console.error("========================================");
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process webhook data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET(req: NextRequest) {
  console.log("=== Webhook GET request ===");
  console.log("URL:", req.url);
  return NextResponse.json(
    { 
      message: "ElevenLabs webhook endpoint is active",
      timestamp: new Date().toISOString(),
      url: req.url
    },
    { status: 200 }
  );
}
