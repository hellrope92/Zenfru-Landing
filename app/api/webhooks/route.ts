import { NextRequest, NextResponse } from "next/server";
import clientPromise, { dbName } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    console.log("=== Webhook received ===");
    
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
    console.log("Webhook type:", body.type);
    console.log("Full webhook payload:", JSON.stringify(body, null, 2));
    
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
        console.log("✅ Call transcription saved:", body.data.conversation_id, "Insert ID:", result.insertedId);
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
