"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function BookingConfirmedPage() {
  const searchParams = useSearchParams();

  const appointmentId   = searchParams.get("id") || "";
  const patientName     = searchParams.get("name") || "Patient";
  const appointmentType = searchParams.get("type") || "";
  const date            = searchParams.get("date") || "";
  const time            = searchParams.get("time") || "";
  const provider        = searchParams.get("provider") || "";

  const formattedDate = useMemo(() => {
    if (!date) return "";
    try {
      return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });
    } catch {
      return date;
    }
  }, [date]);

  return (
    <main className="min-h-screen w-full relative text-slate-900 p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 -z-10" />
      <div className="fixed top-24 -left-40 w-80 h-80 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob-float -z-10" />
      <div className="fixed top-1/3 right-0 w-96 h-96 bg-indigo-300/8 rounded-full mix-blend-multiply filter blur-xl animate-blob-float-reverse -z-10" />

      <div className="mx-auto mt-16 max-w-2xl">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="Zenfru" width={120} height={38} priority className="h-auto w-auto" />
        </div>

        {/* Success card */}
        <div className="rounded-2xl border border-emerald-200 bg-white/90 backdrop-blur-xl p-8 shadow-xl">
          {/* Icon + heading */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200">
              <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Appointment Confirmed!</h1>
            <p className="mt-2 text-slate-500 text-base">All set, you may now close the window.</p>
          </div>

          {/* Details grid */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 divide-y divide-slate-100">
            {[
              { label: "Patient", value: patientName },
              { label: "Appointment Type", value: appointmentType },
              { label: "Date", value: formattedDate || date },
              { label: "Time", value: time },
              ...(provider ? [{ label: "Provider", value: provider }] : []),
              { label: "Booking ID", value: appointmentId, mono: true },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-start gap-4 px-5 py-3.5">
                <span className="w-36 shrink-0 text-sm text-slate-500">{label}</span>
                <span className={`text-sm font-semibold text-slate-800 break-all ${mono ? "font-mono text-xs text-slate-600" : ""}`}>
                  {value || "—"}
                </span>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-400">
            Please save your Booking ID for your records. The clinic will contact you if anything changes.
          </p>
        </div>
      </div>
    </main>
  );
}
