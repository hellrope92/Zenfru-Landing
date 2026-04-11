"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type Doctor = { id: string; name: string; availabilityCount?: number };
type Slot = {
  slotId: string;
  date: string;
  time: string;
  providerId?: string;
  providerName?: string;
};
type AppointmentType = { id: string; name: string; durationMinutes?: number | null };
type BookingSummary = {
  appointmentId: string;
  patientName: string;
  appointmentType: string;
  date: string;
  time: string;
  provider: string;
  bookedFor: string;
};

type TokenResponse = {
  valid: boolean;
  patient: {
    firstName: string;
    treatmentDue: string;
    providerId: string;
    providerName: string;
  };
  doctors: Doctor[];
};

const RESTRICTED_APPOINTMENT_TYPES: AppointmentType[] = [
  { id: "routine_checkup", name: "Routine Checkup" },
  { id: "deep_cleanup", name: "Dental Cleanup" },
];

function normalizeAppointmentTypes(apiTypes: AppointmentType[] = []): AppointmentType[] {
  const findType = (matcher: (item: AppointmentType) => boolean) => apiTypes.find(matcher);
  const routine = findType((item) => {
    const value = `${item.id} ${item.name}`.toLowerCase();
    return value.includes("routine") || value.includes("checkup") || value.includes("check-up");
  });
  const cleanup = findType((item) => {
    const value = `${item.id} ${item.name}`.toLowerCase();
    return value.includes("cleanup") || value.includes("cleaning") || value.includes("deep_cleanup");
  });

  return [
    { id: routine?.id || RESTRICTED_APPOINTMENT_TYPES[0].id, name: RESTRICTED_APPOINTMENT_TYPES[0].name },
    { id: cleanup?.id || RESTRICTED_APPOINTMENT_TYPES[1].id, name: RESTRICTED_APPOINTMENT_TYPES[1].name },
  ];
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toYmd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function monthLabel(date: Date): string {
  return `${MONTHS_FULL[date.getMonth()]} ${date.getFullYear()}`;
}

function dayLabel(ymd: string): string {
  const d = new Date(`${ymd}T00:00:00`);
  return `${WEEK_DAYS[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}

function fullDayLabel(ymd: string): string {
  const d = new Date(`${ymd}T00:00:00`);
  return `${WEEK_DAYS_FULL[d.getDay()]}, ${MONTHS_FULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function timeToMinutes(value: string): number {
  const t = value.trim().toUpperCase();
  if (t.includes("AM") || t.includes("PM")) {
    const [time, period] = t.split(" ");
    const [h, m] = time.split(":").map(Number);
    let hour = h % 12;
    if (period === "PM") hour += 12;
    return hour * 60 + (m || 0);
  }
  const [hh, mm] = value.split(":").map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

function groupSlotsByDayPart(slots: Slot[]) {
  const groups: Record<"Morning" | "Afternoon" | "Evening", Slot[]> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
  };

  const sorted = [...slots].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
  for (const slot of sorted) {
    const minutes = timeToMinutes(slot.time);
    if (minutes < 12 * 60) groups.Morning.push(slot);
    else if (minutes < 17 * 60) groups.Afternoon.push(slot);
    else groups.Evening.push(slot);
  }
  return groups;
}

export default function BookPage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("t") || "", [searchParams]);
  const hasToken = token.trim().length > 0;

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [hasLoadedSlots, setHasLoadedSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(null);
  const [fatalError, setFatalError] = useState("");
  const [inlineError, setInlineError] = useState("");
  const [slotReloadTick, setSlotReloadTick] = useState(0);
  const [lastLoadedSlotDate, setLastLoadedSlotDate] = useState("");
  const [patientName, setPatientName] = useState("");
  const [baseDoctors, setBaseDoctors] = useState<Doctor[]>([]);
  const [providersForDate, setProvidersForDate] = useState<Doctor[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("any");
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
  const [selectedAppointmentTypeId, setSelectedAppointmentTypeId] = useState("general_consultation");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookFor, setBookFor] = useState<"self" | "other">("self");
  const [otherName, setOtherName] = useState("");
  const [otherRelation, setOtherRelation] = useState("");
  const [otherContact, setOtherContact] = useState("");
  const [otherNameTouched, setOtherNameTouched] = useState(false);
  const slotCacheRef = useRef<Record<string, Slot[]>>({});

  const availableDateSet = useMemo(() => new Set(availableDates), [availableDates]);
  const slotGroups = useMemo(() => groupSlotsByDayPart(slots), [slots]);
  const selectedSlotData = useMemo(() => slots.find((slot) => slot.slotId === selectedSlot), [slots, selectedSlot]);
  const selectedProviderName = useMemo(() => {
    if (selectedProvider === "any") {
      return selectedSlotData?.providerName || "Any available provider";
    }
    const provider = providersForDate.find((item) => item.id === selectedProvider)
      || baseDoctors.find((item) => item.id === selectedProvider);
    return provider?.name || selectedSlotData?.providerName || "Any available provider";
  }, [selectedProvider, selectedSlotData, providersForDate, baseDoctors]);
  const otherNameMissing = bookFor === "other" && !otherName.trim();
  const selectedAppointmentTypeName = useMemo(() => {
    return appointmentTypes.find((item) => item.id === selectedAppointmentTypeId)?.name || "general consultation";
  }, [appointmentTypes, selectedAppointmentTypeId]);
  useEffect(() => {
    const init = async () => {
      if (!hasToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/book/validate-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = (await res.json()) as TokenResponse | { detail?: unknown; proxy_error?: boolean; error?: string };
        if (!res.ok) {
          if ((data as { proxy_error?: boolean }).proxy_error || res.status >= 500) {
            setFatalError("Booking service is temporarily unavailable. Please try again in a minute.");
          } else {
            setFatalError("This booking link is invalid or has expired.");
          }
          setIsLoading(false);
          return;
        }

        if (!(data as TokenResponse).valid) {
          setFatalError("This booking link is invalid or has expired.");
          setIsLoading(false);
          return;
        }

        const ok = data as TokenResponse;
        setPatientName(ok.patient.firstName || "Patient");
        setBaseDoctors(ok.doctors || []);
        setProvidersForDate(ok.doctors || []);

        const [typesRes] = await Promise.all([
          fetch(`/api/book/appointment-types?${new URLSearchParams({ token }).toString()}`),
        ]);

        const typeJson = (await typesRes.json()) as { appointmentTypes?: AppointmentType[] };

        const typeOptions = normalizeAppointmentTypes(typeJson.appointmentTypes || []);
        setAppointmentTypes(typeOptions);

        const suggestedType = (ok.patient.treatmentDue || "").trim().toLowerCase();
        const suggested = typeOptions.find((item) => `${item.id} ${item.name}`.toLowerCase().includes(suggestedType));
        const initialTypeId = suggested?.id || typeOptions[0]?.id || RESTRICTED_APPOINTMENT_TYPES[0].id;
        setSelectedAppointmentTypeId(initialTypeId);
      } catch {
        setFatalError("Unable to validate booking link right now.");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [hasToken, token]);

  useEffect(() => {
    const loadDates = async () => {
      if (!hasToken || !selectedAppointmentTypeId || isBooking) return;

      try {
        const params = new URLSearchParams({ token, appointmentTypeId: selectedAppointmentTypeId });
        const datesRes = await fetch(`/api/book/dates?${params.toString()}`);
        const dateJson = (await datesRes.json()) as { availableDates?: string[] };

        let dates = (dateJson.availableDates || []).sort();
        if (!dates.length) {
          const fallbackDoctor = baseDoctors?.[0]?.id || "default";
          const fallbackParams = new URLSearchParams({
            token,
            doctorId: fallbackDoctor,
            appointmentTypeId: selectedAppointmentTypeId,
          });
          const fallbackRes = await fetch(`/api/book/availability?${fallbackParams.toString()}`);
          const fallbackJson = (await fallbackRes.json()) as { slots?: Slot[] };
          const fallbackSlots = fallbackJson.slots || [];
          dates = Array.from(new Set(fallbackSlots.map((s) => s.date))).sort();
        }

        setAvailableDates(dates);
        setInlineError("");

        if (!dates.length) {
          setSelectedDate("");
          setSlots([]);
          setSelectedSlot("");
          setHasLoadedSlots(false);
          setIsLoadingSlots(false);
          return;
        }

        const keepCurrent = selectedDate && dates.includes(selectedDate);
        const nextDate = keepCurrent ? selectedDate : dates[0];

        if (!keepCurrent) {
          setSelectedDate(nextDate);
          setSelectedSlot("");
          setSlots([]);
          setHasLoadedSlots(false);
          setIsLoadingSlots(true);
          const firstDate = new Date(`${nextDate}T00:00:00`);
          setVisibleMonth(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
        }
      } catch {
        setInlineError("Could not load available dates.");
      }
    };

    loadDates();
  }, [hasToken, token, selectedAppointmentTypeId, baseDoctors, selectedDate, isBooking]);

  useEffect(() => {
    const controller = new AbortController();
    const loadProviders = async () => {
      if (!hasToken || !selectedDate) return;
      try {
        const params = new URLSearchParams({ token, date: selectedDate, appointmentTypeId: selectedAppointmentTypeId });
        const res = await fetch(`/api/book/providers?${params.toString()}`, { signal: controller.signal });
        const data = (await res.json()) as { providers?: Doctor[] };

        let providers = data.providers || [];
        if (!res.ok || !providers.length) {
          // Backward-compat: old backend lacks providers endpoint; use validated doctors list.
          providers = baseDoctors;
        }
        setProvidersForDate(providers);

        // Keep user's provider selection if it is still valid for this date.
        setSelectedProvider((current) => {
          if (current === "any") return "any";
          const stillAvailable = providers.some((provider) => provider.id === current);
          return stillAvailable ? current : "any";
        });
      } catch {
        setProvidersForDate(baseDoctors);
      }
    };

    setInlineError("");
    setSelectedSlot("");
    setSlots([]);
    setHasLoadedSlots(false);
    setIsLoadingSlots(true);
    loadProviders();

    return () => controller.abort();
  }, [hasToken, selectedDate, selectedAppointmentTypeId, token, baseDoctors]);

  useEffect(() => {
    const controller = new AbortController();

    const loadSlots = async () => {
      if (!hasToken || !selectedDate) return;

      const effectiveDoctorId = selectedProvider !== "any"
        ? selectedProvider
        : (baseDoctors[0]?.id || "");
      const cacheKey = `${token}|${selectedDate}|${selectedAppointmentTypeId}|${effectiveDoctorId || "any"}`;

      if (slotCacheRef.current[cacheKey]) {
        setSlots(slotCacheRef.current[cacheKey]);
        setLastLoadedSlotDate(selectedDate);
        setHasLoadedSlots(true);
        setIsLoadingSlots(false);
        return;
      }

      setHasLoadedSlots(false);
      setIsLoadingSlots(true);
      setSelectedSlot("");
      setInlineError("");

      try {
        const params = new URLSearchParams({ token, date: selectedDate });
        params.set("appointmentTypeId", selectedAppointmentTypeId);
        if (selectedProvider !== "any") {
          params.set("doctorId", selectedProvider);
        } else if (baseDoctors.length) {
          // Backward-compat: old backend requires doctorId.
          params.set("doctorId", baseDoctors[0].id);
        }
        const res = await fetch(`/api/book/availability?${params.toString()}`, { signal: controller.signal });
        const data = (await res.json()) as { slots?: Slot[]; detail?: string };

        if (!res.ok) {
          setInlineError(typeof data.detail === "string" ? data.detail : "Could not load available slots.");
          setSlots([]);
          return;
        }

        const list = (data.slots || []).filter((slot) => slot.date === selectedDate);
        slotCacheRef.current[cacheKey] = list;
        setSlots(list);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        setInlineError("Could not load available slots.");
        setSlots([]);
      } finally {
        setLastLoadedSlotDate(selectedDate);
        setIsLoadingSlots(false);
        setHasLoadedSlots(true);
      }
    };

    loadSlots();
    return () => controller.abort();
  }, [hasToken, selectedDate, selectedProvider, selectedAppointmentTypeId, token, baseDoctors, slotReloadTick]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leading = first.getDay();

    const cells: Array<{ ymd: string; day: number; inCurrentMonth: boolean }> = [];
    for (let i = 0; i < leading; i += 1) {
      const d = new Date(year, month, i - leading + 1);
      cells.push({ ymd: toYmd(d), day: d.getDate(), inCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const d = new Date(year, month, day);
      cells.push({ ymd: toYmd(d), day, inCurrentMonth: true });
    }

    const trailing = (7 - (cells.length % 7)) % 7;
    for (let i = 1; i <= trailing; i += 1) {
      const d = new Date(year, month, daysInMonth + i);
      cells.push({ ymd: toYmd(d), day: d.getDate(), inCurrentMonth: false });
    }

    return cells;
  }, [visibleMonth]);

  const confirmBooking = async () => {
    if (isBooking) {
      return;
    }

    if (!hasToken || !selectedSlot) {
      setInlineError("Please select a slot first.");
      return;
    }

    if (otherNameMissing) {
      setOtherNameTouched(true);
      setInlineError("Name is required.");
      return;
    }

    setInlineError("");
    setIsBooking(true);

    try {
      const res = await fetch("/api/book/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          slotId: selectedSlot,
          treatment: selectedAppointmentTypeName,
          appointmentTypeId: selectedAppointmentTypeId,
          providerId: selectedProvider === "any" ? "" : selectedProvider,
          bookFor,
          otherName: bookFor === "other" ? otherName.trim() : "",
          otherRelation: bookFor === "other" ? otherRelation.trim() : "",
          otherContact: bookFor === "other" ? otherContact.trim() : "",
        }),
      });

      const data = (await res.json()) as { success?: boolean; appointmentId?: string; detail?: string };

      if (!res.ok || !data.success) {
        const message = typeof data.detail === "string" ? data.detail : "Booking failed. Please try another slot.";
        setInlineError(message);
        if (message.includes("no longer available")) {
          setSelectedSlot("");
          setSlotReloadTick((value) => value + 1);
        }
        setIsBooking(false);
        return;
      }

      setIsBooked(true);
      setBookingSummary({
        appointmentId: data.appointmentId || "",
        patientName: bookFor === "other" ? otherName.trim() || patientName : patientName,
        appointmentType: selectedAppointmentTypeName,
        date: selectedSlotData?.date || selectedDate,
        time: selectedSlotData?.time || "",
        provider: selectedProviderName,
        bookedFor: bookFor === "other"
          ? `Family Member / Other${otherRelation.trim() ? ` (${otherRelation.trim()})` : ""}`
          : "Self",
      });
      setIsBooking(false);
    } catch {
      setInlineError("Booking failed due to a network error.");
      setIsBooking(false);
    }
  };

  if (!hasToken) {
    return (
      <main className="min-h-screen w-full relative text-slate-900 dark:text-white p-6">
        <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:via-indigo-950/15 dark:to-slate-900 -z-10"></div>
        <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 dark:opacity-15 -z-10"></div>
        <div className="fixed top-24 -left-40 w-80 h-80 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob-float -z-10"></div>
        <div className="fixed top-1/3 right-0 w-96 h-96 bg-indigo-300/8 rounded-full mix-blend-multiply filter blur-xl animate-blob-float-reverse animation-delay-2000 -z-10"></div>

        <div className="mx-auto mt-24 max-w-2xl rounded-2xl border border-blue-100/80 bg-white/80 backdrop-blur-xl p-8 shadow-xl">
          <h1 className="text-[clamp(1.1rem,5.2vw,2rem)] font-bold tracking-tight leading-tight text-slate-900 whitespace-nowrap">Grand Dental Scheduler</h1>
          <p className="mt-3 text-slate-600 text-lg">
            This page is ready for booking, but you need a secure SMS link token to continue.
          </p>
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-slate-700">
            Open the booking link from your SMS message or request a new link from the clinic.
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border-2 border-blue-600 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-600 hover:text-white transition-smooth"
            >
              Back to Homepage
            </Link>
            <Link
              href="https://calendly.com/kay-zenfru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3 font-semibold text-white hover:from-blue-700 hover:to-indigo-800 transition-smooth"
            >
              Book Call Instead
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (fatalError) {
    return (
      <main className="min-h-screen w-full relative text-slate-900 dark:text-white p-6">
        <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:via-indigo-950/15 dark:to-slate-900 -z-10"></div>
        <div className="mx-auto mt-24 max-w-2xl rounded-2xl border border-red-100 bg-white/90 p-8 shadow-xl">
          <h1 className="text-[clamp(1.1rem,5.2vw,2rem)] font-bold tracking-tight leading-tight text-slate-900 whitespace-nowrap">Grand Dental Scheduler</h1>
          <p className="mt-4 text-red-600">{fatalError}</p>
        </div>
      </main>
    );
  }

  if (isBooked) {
    return (
      <main className="min-h-screen w-full relative text-slate-900 dark:text-white p-6">
        <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:via-indigo-950/15 dark:to-slate-900 -z-10"></div>
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-emerald-200 bg-white/90 p-6 sm:p-8 shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-700">Appointment Confirmed</h1>
            <p className="mt-2 text-slate-600">All set, you may now close the window.</p>
          </div>

          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 divide-y divide-slate-100">
            {[
              { label: "Patient", value: bookingSummary?.patientName || patientName || "Patient" },
              { label: "Booked For", value: bookingSummary?.bookedFor || "Self" },
              { label: "Appointment Type", value: bookingSummary?.appointmentType || selectedAppointmentTypeName },
              { label: "Date", value: bookingSummary?.date ? fullDayLabel(bookingSummary.date) : "-" },
              { label: "Time", value: bookingSummary?.time || "-" },
              { label: "Provider", value: bookingSummary?.provider || "Any available provider" },
              { label: "Booking ID", value: bookingSummary?.appointmentId || "-", mono: true },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-start gap-4 px-4 py-3 sm:px-5">
                <span className="w-36 shrink-0 text-sm text-slate-500">{label}</span>
                <span className={`text-sm font-semibold text-slate-800 break-all ${mono ? "font-mono text-xs text-slate-600" : ""}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">Please keep your Booking ID for reference.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full relative text-slate-900 dark:text-white p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:via-indigo-950/15 dark:to-slate-900 -z-10"></div>
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 dark:opacity-15 -z-10"></div>
      <div className="fixed top-24 -left-40 w-80 h-80 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob-float -z-10"></div>
      <div className="fixed top-1/3 right-0 w-96 h-96 bg-indigo-300/8 rounded-full mix-blend-multiply filter blur-xl animate-blob-float-reverse animation-delay-2000 -z-10"></div>

      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-blue-100/80 bg-white/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        <div className="mb-2 inline-flex items-center" aria-label="Zenfru logo">
          <Image src="/logo.png" alt="Zenfru" width={124} height={38} priority className="h-auto w-auto" />
        </div>
        <h1 className="text-[clamp(1.1rem,5.2vw,2.25rem)] font-bold tracking-tight leading-tight text-slate-900 whitespace-nowrap">Grand Dental Scheduler</h1>
        <p className="mt-3 text-slate-600 text-lg">
          Hi {patientName}, let&apos;s schedule your appointment.
        </p>
        {isLoading && (
          <p className="mt-2 text-sm text-slate-500">Verifying your secure booking link...</p>
        )}

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Who is this appointment for?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`min-h-[44px] rounded-xl border px-4 py-3 text-sm font-semibold transition ${bookFor === "self" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-blue-100 bg-white text-slate-700"}`}
              onClick={() => {
                setBookFor("self");
                setOtherNameTouched(false);
                setInlineError("");
              }}
              disabled={isBooking}
            >
              Self
            </button>
            <button
              type="button"
              className={`min-h-[44px] rounded-xl border px-4 py-3 text-sm font-semibold transition ${bookFor === "other" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-blue-100 bg-white text-slate-700"}`}
              onClick={() => setBookFor("other")}
              disabled={isBooking}
            >
              Family Member / Other
            </button>
          </div>
        </div>

        {bookFor === "other" && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              className={`min-h-[44px] rounded-xl border bg-white px-4 py-3 text-slate-800 shadow-sm focus:outline-none focus:ring-2 ${otherNameTouched && otherNameMissing ? "border-red-300 focus:ring-red-300" : "border-blue-100 focus:ring-blue-300"}`}
              placeholder="Name *"
              value={otherName}
              onChange={(e) => {
                setOtherName(e.target.value);
                if (e.target.value.trim()) {
                  setInlineError("");
                }
              }}
              onBlur={() => setOtherNameTouched(true)}
              disabled={isBooking}
            />
            <input
              className="min-h-[44px] rounded-xl border border-blue-100 bg-white px-4 py-3 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Relation (optional)"
              value={otherRelation}
              onChange={(e) => setOtherRelation(e.target.value)}
              disabled={isBooking}
            />
            <input
              className="min-h-[44px] rounded-xl border border-blue-100 bg-white px-4 py-3 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 sm:col-span-2"
              placeholder="Contact number (optional)"
              value={otherContact}
              onChange={(e) => setOtherContact(e.target.value)}
              disabled={isBooking}
            />
            {otherNameTouched && otherNameMissing && (
              <p className="sm:col-span-2 text-sm font-medium text-red-600">Name is required.</p>
            )}
          </div>
        )}

        <div className="mt-8">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Appointment type</label>
          <div className="relative w-full max-w-sm">
            <select
              className="w-full appearance-none rounded-xl border border-blue-100 bg-white py-3 pl-4 pr-10 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={selectedAppointmentTypeId}
              onChange={(e) => setSelectedAppointmentTypeId(e.target.value)}
              disabled={isLoading || isBooking}
            >
              {appointmentTypes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Select a date</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border border-blue-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-blue-50"
                onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded-lg border border-blue-100 px-3 py-1.5 text-sm text-slate-700 hover:bg-blue-50"
                onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              >
                Next
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm text-slate-500">{monthLabel(visibleMonth)}</p>

          <div className="mt-4 overflow-x-auto -mx-1 px-1">
            <div className="min-w-[320px]">
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
                {WEEK_DAYS.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-2">
                {calendarDays.map((cell) => {
                  const isAvailable = availableDateSet.has(cell.ymd);
                  const isSelected = selectedDate === cell.ymd;
                  return (
                    <button
                      key={`${cell.ymd}-${cell.day}`}
                      type="button"
                      disabled={!isAvailable || isBooking}
                      onClick={() => {
                        if (selectedDate === cell.ymd) return;
                        setInlineError("");
                        setSelectedDate(cell.ymd);
                        setSelectedSlot("");
                        setSlots([]);
                        setHasLoadedSlots(false);
                        setIsLoadingSlots(true);
                      }}
                      className={`min-h-[44px] rounded-lg text-sm transition ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : isAvailable
                            ? "border border-blue-100 bg-blue-50/60 text-blue-700 hover:bg-blue-100"
                            : "border border-slate-100 bg-slate-50 text-slate-300"
                      } ${!cell.inCurrentMonth ? "opacity-50" : ""}`}
                      title={fullDayLabel(cell.ymd)}
                      aria-label={fullDayLabel(cell.ymd)}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Preferred provider</label>
          <select
            className="w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            disabled={!selectedDate || isBooking}
          >
            <option value="any">Any available provider</option>
            {(providersForDate.length ? providersForDate : baseDoctors).map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}{provider.availabilityCount ? ` (${provider.availabilityCount} slots)` : ""}
              </option>
            ))}
          </select>
        </div>

        {selectedDate && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-700">
            Selected date: <span className="font-semibold text-blue-700">{fullDayLabel(selectedDate)}</span>
          </div>
        )}

        {selectedDate && (
          <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-4 sm:p-5">
            <h3 className="text-lg font-semibold text-slate-900">Choose a time slot</h3>
            <p className="mt-1 text-sm text-slate-500">Showing slots for {dayLabel(selectedDate)}.</p>

            {inlineError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {inlineError}
              </div>
            )}

            {isLoadingSlots && <p className="mt-4 text-sm text-slate-500">Loading available slots...</p>}
            {!isLoadingSlots && hasLoadedSlots && lastLoadedSlotDate === selectedDate && slots.length === 0 && (
              <p className="mt-4 text-sm text-slate-600">No slots available for this date. Please choose another date.</p>
            )}

            {!isLoadingSlots && slots.length > 0 && (
              <div className="mt-4 space-y-4">
                {(Object.entries(slotGroups) as Array<["Morning" | "Afternoon" | "Evening", Slot[]]>).map(([label, group]) => {
                  if (group.length === 0) return null;
                  return (
                    <div key={label}>
                      <p className="mb-2 text-sm font-semibold text-slate-700">{label}</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {group.map((slot) => (
                          <button
                            key={slot.slotId}
                            type="button"
                            onClick={() => setSelectedSlot(slot.slotId)}
                            disabled={isBooking}
                            className={`min-h-[44px] rounded-lg border px-3 py-2 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${
                              selectedSlot === slot.slotId
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-blue-100 bg-white text-slate-700 hover:bg-blue-50"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedSlotData && (
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-slate-700">
                <p>
                  Selected slot: <span className="font-semibold text-blue-700">{selectedSlotData.time}</span> on {fullDayLabel(selectedSlotData.date)}
                </p>
                {isBooking && (
                  <div className="mt-2 inline-flex items-center gap-2 text-slate-600">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" aria-hidden="true"></span>
                    <span className="text-xs sm:text-sm">Finalizing your booking...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={confirmBooking}
            className="w-full sm:w-auto min-h-[44px] rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 text-white font-semibold hover:from-blue-700 hover:to-indigo-800 transition-smooth disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!selectedSlot || !selectedDate || isLoading || isLoadingSlots || isBooking || otherNameMissing}
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isBooking && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true"></span>}
              {isBooking ? "Booking" : "Confirm"}
            </span>
          </button>
        </div>

        <div className="mt-6 flex justify-center sm:justify-start">
          <Link
            href="/book/unsubscribe"
            className="text-sm font-medium text-slate-400 hover:text-slate-500 transition-smooth"
          >
            Stop / Unsubscribe
          </Link>
        </div>
      </div>
    </main>
  );
}
