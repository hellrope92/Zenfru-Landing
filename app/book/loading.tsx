export default function LoadingBookPage() {
  return (
    <main className="min-h-screen w-full relative text-slate-900 p-6">
      <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 -z-10"></div>
      <div className="mx-auto mt-20 max-w-3xl rounded-2xl border border-blue-100/80 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        <div className="h-8 w-48 rounded bg-slate-200 animate-pulse"></div>
        <div className="mt-4 h-5 w-72 rounded bg-slate-200 animate-pulse"></div>
        <div className="mt-8 h-12 w-full rounded-xl bg-slate-200 animate-pulse"></div>
        <div className="mt-6 h-12 w-full rounded-xl bg-slate-200 animate-pulse"></div>
        <div className="mt-6 h-11 w-44 rounded-xl bg-slate-300 animate-pulse"></div>
      </div>
    </main>
  );
}
