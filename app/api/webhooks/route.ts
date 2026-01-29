import { NextRequest, NextResponse } from "next/server";
import clientPromise, { dbName } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'auto';

// Handle OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-elevenlabs-signature',
    },
  });
}

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

      // Helper function to extract caller info from transcript
      const extractCallerInfo = (transcript: any[], summary: string) => {
        let callerName = "Unknown Caller";
        let callerNumber = "N/A";
        
        // Only extract from USER messages (not agent messages)
        if (transcript && transcript.length > 0) {
          // Filter only user messages
          const userMessages = transcript.filter(t => t.role === "user");
          const userText = userMessages.map(t => t.message).join(" ");
          
          // Look for name patterns in user messages (case insensitive)
          const nameMatch = userText.match(/(?:my name is|I'm|I am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
          if (nameMatch && nameMatch[1]) {
            callerName = nameMatch[1].trim();
          }
          
          // Look for phone number patterns in user messages
          const phoneMatch = userText.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4})/);
          if (phoneMatch && phoneMatch[1]) {
            callerNumber = phoneMatch[1];
          }
        }
        
        // Also try from summary
        if (summary) {
          const nameInSummary = summary.match(/(?:patient|caller|customer|client)\s+(?:named|called|is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
          if (nameInSummary && nameInSummary[1] && callerName === "Unknown Caller") {
            callerName = nameInSummary[1].trim();
          }
          
          const phoneInSummary = summary.match(/(?:phone|number|contact).*?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4})/i);
          if (phoneInSummary && phoneInSummary[1] && callerNumber === "N/A") {
            callerNumber = phoneInSummary[1];
          }
        }
        
        return { callerName, callerNumber };
      };

      // Helper function to determine call outcome from summary and transcript
      const determineCallOutcome = (summary: string, transcript: any[], analysis: any) => {
        const lowerSummary = summary.toLowerCase();
        const callSuccessful = analysis?.call_successful;
        
        // Check for booking/appointment confirmation
        if (lowerSummary.includes("booked") || 
            lowerSummary.includes("scheduled") || 
            lowerSummary.includes("appointment confirmed") ||
            lowerSummary.includes("appointment set")) {
          return "Booked";
        }
        
        // Check for callback request
        if (lowerSummary.includes("call back") || 
            lowerSummary.includes("callback") || 
            lowerSummary.includes("will call") ||
            lowerSummary.includes("reach out later") ||
            lowerSummary.includes("contact later")) {
          return "Call Back";
        }
        
        // Check for engaged conversation (successful but not booked)
        if (callSuccessful === "success" || 
            lowerSummary.includes("answered") || 
            lowerSummary.includes("provided information") ||
            lowerSummary.includes("discussed") ||
            lowerSummary.includes("explained")) {
          return "Engaged";
        }
        
        // Default to Engaged if call was successful
        return "Engaged";
      };

      // Helper function to determine call purpose from summary
      const determineCallPurpose = (summary: string) => {
        if (!summary) return "General Inquiry";
        
        const lowerSummary = summary.toLowerCase();
        
        // Check for common purposes
        if (lowerSummary.includes("appointment") || lowerSummary.includes("schedule") || lowerSummary.includes("booking")) {
          return "Appointment Scheduling";
        } else if (lowerSummary.includes("reschedule") || lowerSummary.includes("change appointment")) {
          return "Reschedule Appointment";
        } else if (lowerSummary.includes("cancel")) {
          return "Cancel Appointment";
        } else if (lowerSummary.includes("emergency") || lowerSummary.includes("urgent") || lowerSummary.includes("pain")) {
          return "Emergency/Urgent Care";
        } else if (lowerSummary.includes("insurance") || lowerSummary.includes("billing") || lowerSummary.includes("payment")) {
          return "Billing/Insurance Inquiry";
        } else if (lowerSummary.includes("prescription") || lowerSummary.includes("medication") || lowerSummary.includes("refill")) {
          return "Prescription/Medication";
        } else if (lowerSummary.includes("results") || lowerSummary.includes("test")) {
          return "Test Results";
        } else if (lowerSummary.includes("new patient") || lowerSummary.includes("first visit")) {
          return "New Patient Inquiry";
        } else if (lowerSummary.includes("question") || lowerSummary.includes("inquiry") || lowerSummary.includes("information")) {
          return "General Inquiry";
        } else {
          return "Other";
        }
      };

      // Extract summary and transcript
      const summary = body.data.analysis?.transcript_summary || "";
      const transcript = body.data.transcript || [];
      const analysis = body.data.analysis;
      
      // Extract caller info from transcript and summary
      const { callerName, callerNumber } = extractCallerInfo(transcript, summary);
      
      // Determine call purpose from summary
      const callPurpose = determineCallPurpose(summary);
      
      // Determine call outcome
      const callOutcome = determineCallOutcome(summary, transcript, analysis);

      // Extract transcription data
      const callData = {
        conversationId: body.data.conversation_id,
        agentId: body.data.agent_id,
        userId: dbUserId, // Link to our database user
        elevenLabsUserId: body.data.user_id, // Store original ElevenLabs user_id
        status: body.data.status,
        callerName: callerName,
        callerNumber: callerNumber,
        callType: body.data.conversation_initiation_client_data?.dynamic_variables?.call_type || "inbound",
        callAttempt: body.data.conversation_initiation_client_data?.dynamic_variables?.attempt_number || 1,
        callPurpose: callPurpose,
        callOutcome: callOutcome,
        transcript: transcript,
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
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
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
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        }
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
