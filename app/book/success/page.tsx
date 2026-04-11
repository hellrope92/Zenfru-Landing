"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();

  const appointmentId = searchParams.get("id") || "";
  const patientName = searchParams.get("name") || "Patient";
  const appointmentType = searchParams.get("type") || "";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const provider = searchParams.get("provider") || "";
  const bookedFor = searchParams.get("bookedFor") || "Self";

  const formattedDate = useMemo(() => {
    if (!date) return "";
    try {
      return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return date;
    }
  }, [date]);

  return (
    <main className="min-h-screen w-full relative text-slate-900 dark:text-white p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:via-indigo-950/15 dark:to-slate-900 -z-10"></div>
      <div className="fixed top-24 -left-40 w-80 h-80 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob-float -z-10"></div>
      <div className="fixed top-1/3 right-0 w-96 h-96 bg-indigo-300/8 rounded-full mix-blend-multiply filter blur-xl animate-blob-float-reverse -z-10"></div>

      <div className="mx-auto mt-16 max-w-2xl">
        <div className="mb-8 flex justify-center">
          <Image src="/logo.png" alt="Zenfru" width={120} height={38} priority className="h-auto w-auto" />
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white/95 p-6 sm:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-emerald-700">Appointment Confirmed</h1>
            <p className="mt-2 text-slate-600">All set, you may now close the window.</p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/70 divide-y divide-slate-100">
            {[
              { label: "Patient", value: patientName },
              { label: "Booked For", value: bookedFor },
              { label: "Appointment Type", value: appointmentType || "-" },
              { label: "Date", value: formattedDate || date || "-" },
              { label: "Time", value: time || "-" },
              { label: "Provider", value: provider || "Any available provider" },
              { label: "Booking ID", value: appointmentId || "-", mono: true },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-start gap-4 px-4 py-3 sm:px-5">
                <span className="w-36 shrink-0 text-sm text-slate-500">{label}</span>
                <span className={`text-sm font-semibold text-slate-800 break-all ${mono ? "font-mono text-xs text-slate-600" : ""}`}>{value}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">Please keep your Booking ID for reference.</p>
        </div>
      </div>
    </main>
  );
}
