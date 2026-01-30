import { NextResponse } from "next/server";

export async function GET() {
  try {
    const currentDate = new Date();
    
    return NextResponse.json({
      success: true,
      date: currentDate.toISOString(),
      timestamp: currentDate.getTime(),
      formatted: {
        full: currentDate.toLocaleString(),
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
