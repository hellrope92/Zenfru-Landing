import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise, { dbName } from "@/lib/mongodb";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const devBypass = process.env.DEV_BYPASS_AUTH === "true";

    // Check authentication
    const session = await getServerSession(authOptions);
    if ((!session || !session.user?.email) && !devBypass) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(dbName);

    // Get the user's ID from the users collection
    const user = session?.user?.email
      ? await db.collection("users").findOne({ email: session.user.email })
      : null;

    if (!user && !devBypass) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Primary source: Next.js calls collection
    let calls = user
      ? await db
          .collection("calls")
          .find({ userId: user._id.toString() })
          .sort({ "metadata.startTime": -1 })
          .toArray()
      : [];

    // Fallback source: Python backend logs collection
    if (!calls.length) {
      const logs = await db
        .collection("CallLogs")
        .find({ patient_id: { $exists: true } })
        .sort({ called_at: -1 })
        .limit(300)
        .toArray();

      calls = logs.map((log: any) => {
        const duration = Number(log.call_duration_secs || 0);
        const calledAt = log.called_at || log.created_at || new Date();
        return {
          _id: log._id?.toString?.() || log.conversation_id || String(calledAt),
          conversationId: log.conversation_id || "",
          agentId: "",
          userId: user?._id?.toString?.() || "dev-user",
          status: log.elevenlabs_status || "unknown",
          callerName: log.patient_name || "Unknown Caller",
          callerNumber: log.phone_number || "",
          callType: "outbound",
          callAttempt: 1,
          callPurpose: log.data_collection?.appointment_reason || log.appointment_type || "recall",
          callOutcome: log.normalized_outcome || log.call_outcome || "Unknown",
          transcript: Array.isArray(log.transcript) ? log.transcript : [],
          metadata: {
            startTime: calledAt,
            duration,
            cost: 0,
            terminationReason: log.termination_reason || "",
            feedback: {
              overall_score: null,
              likes: 0,
              dislikes: 0,
            },
          },
          analysis: {
            callSuccessful: log.call_outcome === "success" || log.normalized_outcome === "booked" ? "success" : "unknown",
            summary: log.transcript_summary || "",
            evaluationResults: log.evaluation_criteria || {},
            dataCollectionResults: log.data_collection || {},
          },
          conversationInitiationData: {
            dynamic_variables: {
              user_name: log.patient_name || "",
            },
          },
          eventTimestamp: calledAt,
          createdAt: calledAt,
          hasAudio: false,
          audioUrl: null,
        };
      });
    }

    return NextResponse.json(
      { success: true, calls },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
