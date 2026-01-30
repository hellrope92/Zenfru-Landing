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
          
          // Enhanced name patterns (case insensitive, more flexible)
          const namePatterns = [
            /(?:my name is|my name's|name is|name's|I'm|I am|this is|it's|speaking,?\s+this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
            /(?:^|\.\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:here|speaking|calling)/i,
            /(?:call me|you can call me)\s+([A-Z][a-z]+)/i,
          ];
          
          for (const pattern of namePatterns) {
            const nameMatch = userText.match(pattern);
            if (nameMatch && nameMatch[1] && !nameMatch[1].match(/^(yes|no|hello|hi|hey|okay|ok|sure|thank|thanks)$/i)) {
              callerName = nameMatch[1].trim();
              break;
            }
          }
          
          // Look for phone number patterns in user messages
          const phoneMatch = userText.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4})/);
          if (phoneMatch && phoneMatch[1]) {
            callerNumber = phoneMatch[1];
          }
        }
        
        // Also try from summary with enhanced patterns
        if (summary && callerName === "Unknown Caller") {
          const summaryPatterns = [
            /(?:patient|caller|customer|client|person)\s+(?:named|called|is|name is|identified as)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
            /(?:^|\.\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:called|contacted|reached out|phoned)/i,
            /(?:from|by)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:regarding|about|to)/i,
          ];
          
          for (const pattern of summaryPatterns) {
            const nameInSummary = summary.match(pattern);
            if (nameInSummary && nameInSummary[1] && !nameInSummary[1].match(/^(yes|no|hello|hi|hey|okay|ok|sure|thank|thanks|the|a|an)$/i)) {
              callerName = nameInSummary[1].trim();
              break;
            }
          }
          
          // Look for phone number in summary
          const phoneInSummary = summary.match(/(?:phone|number|contact|reach|callback).*?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4})/i);
          if (phoneInSummary && phoneInSummary[1] && callerNumber === "N/A") {
            callerNumber = phoneInSummary[1];
          }
        }
        
        console.log("Extracted caller info - Name:", callerName, "Number:", callerNumber);
        
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

      // Helper function to determine call purpose from summary and transcript
      const determineCallPurpose = (summary: string, transcript: any[]) => {
        if (!summary && (!transcript || transcript.length === 0)) return "General Inquiry";
        
        // Combine summary and user messages from transcript for better analysis
        let combinedText = summary ? summary.toLowerCase() : "";
        
        if (transcript && transcript.length > 0) {
          const userMessages = transcript.filter(t => t.role === "user");
          const userText = userMessages.map(t => t.message).join(" ").toLowerCase();
          combinedText += " " + userText;
        }
        
        // Check for specific purposes in order of priority (most specific first)
        
        // Cancellation - check before general appointment keywords
        if (combinedText.match(/\b(cancel|canceling|cancelling|cancelled|cancel my|don't need|no longer need|want to cancel)\b/i)) {
          return "Cancel Appointment";
        }
        
        // Rescheduling - check before general appointment/schedule keywords
        if (combinedText.match(/\b(reschedule|rescheduling|change|move|shift|different time|different day|change my appointment|move my appointment)\b/i)) {
          return "Reschedule Appointment";
        }
        
        // Callback request
        if (combinedText.match(/\b(call back|callback|call me back|return call|reach out|contact me)\b/i)) {
          return "Call Back Request";
        }
        
        // Emergency/Urgent
        if (combinedText.match(/\b(emergency|urgent|asap|right away|immediately|severe pain|can't wait)\b/i)) {
          return "Emergency/Urgent Care";
        }
        
        // Insurance/Billing
        if (combinedText.match(/\b(insurance|billing|payment|charge|invoice|claim|coverage|copay|deductible)\b/i)) {
          return "Billing/Insurance Inquiry";
        }
        
        // Prescription/Medication
        if (combinedText.match(/\b(prescription|medication|medicine|refill|pharmacy|drug|pills)\b/i)) {
          return "Prescription/Medication";
        }
        
        // Test Results
        if (combinedText.match(/\b(test results?|lab results?|blood work|x-ray|scan results?|report)\b/i)) {
          return "Test Results";
        }
        
        // New Patient
        if (combinedText.match(/\b(new patient|first (time|visit)|never been|haven't been before)\b/i)) {
          return "New Patient Inquiry";
        }
        
        // General appointment scheduling - only if no specific action (cancel/reschedule) was mentioned
        if (combinedText.match(/\b(appointment|schedule|book|booking|slot|available|time|day)\b/i)) {
          return "Appointment Scheduling";
        }
        
        // General inquiry
        if (combinedText.match(/\b(question|inquiry|information|ask|wondering|curious|know more)\b/i)) {
          return "General Inquiry";
        }
        
        console.log("Call purpose analysis - Combined text preview:", combinedText.substring(0, 200));
        
        return "Other";
      };

      // Extract summary and transcript
      const summary = body.data.analysis?.transcript_summary || "";
      const transcript = body.data.transcript || [];
      const analysis = body.data.analysis;
      
      // Extract caller info from transcript and summary
      const { callerName, callerNumber } = extractCallerInfo(transcript, summary);
      
      // Determine call purpose from summary AND transcript
      const callPurpose = determineCallPurpose(summary, transcript);
      
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
