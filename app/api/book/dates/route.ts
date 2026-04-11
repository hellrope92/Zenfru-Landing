import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.BOOKING_API_BASE_URL || "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token") || "";
    const doctorId = searchParams.get("doctorId") || "";
    const appointmentTypeId = searchParams.get("appointmentTypeId") || "";

    const params = new URLSearchParams({ token });
    if (doctorId) params.set("doctorId", doctorId);
    if (appointmentTypeId) params.set("appointmentTypeId", appointmentTypeId);

    const upstream = await fetch(`${API_BASE}/api/book/dates?${params.toString()}`, {
      method: "GET",
    });

    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "dates proxy failed" }, { status: 502 });
  }
}
