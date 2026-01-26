import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(dbName);

    // Get the user's ID from the users collection
    const user = await db.collection("users").findOne({
      email: session.user.email
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch calls for this specific user only
    const calls = await db
      .collection("calls")
      .find({ userId: user._id.toString() })
      .sort({ "metadata.startTime": -1 })
      .toArray();

    return NextResponse.json(
      { success: true, calls },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching calls:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calls" },
      { status: 500 }
    );
  }
}
