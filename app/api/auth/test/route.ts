import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Check if we can connect and find users
    const users = await db.collection("users").find({}).toArray();
    
    return NextResponse.json({
      success: true,
      dbName: dbName,
      userCount: users.length,
      users: users.map(u => ({
        email: u.email,
        hasPassword: !!u.password,
        passwordLength: u.password?.length || 0
      }))
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
