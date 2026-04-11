"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DemoSection from "@/components/DemoSection";
import CoreValueSection from "@/components/Features";

// Dynamic imports for sections below the fold
const PMSIntegrationSection = dynamic(() => import("@/components/PMSIntegrationSection"), {
  loading: () => <div className="h-96 bg-slate-50 dark:bg-slate-900 animate-pulse" />,
  ssr: true,
});

const PilotResultsSection = dynamic(() => import("@/components/PilotResultsSection"), {
  loading: () => <div className="h-96 bg-white dark:bg-slate-800 animate-pulse" />,
  ssr: true,
});

const FAQSection = dynamic(() => import("@/components/FAQSection"), {
  loading: () => <div className="h-96 bg-slate-50 dark:bg-slate-900 animate-pulse" />,
  ssr: true,
});

const CTA = dynamic(() => import("@/components/CTA"), {
  loading: () => <div className="h-64 bg-blue-600 animate-pulse" />,
  ssr: true,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-64 bg-gray-50 dark:bg-gray-900 animate-pulse" />,
  ssr: true,
});

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingToken = searchParams.get("t") || "";
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const tokenHref = bookingToken ? `/book?t=${encodeURIComponent(bookingToken)}` : "/book";
    router.prefetch("/book");
    router.prefetch(tokenHref);
  }, [bookingToken, router]);

  const handleShowDemo = () => {
    setShowDemo(true);
  };

  const handleBackToHome = () => {
    setShowDemo(false);
  };

  if (showDemo) {
    return (
      <div className="min-h-screen w-full relative text-slate-900 dark:text-white">
        <Navbar bookingToken={bookingToken} />
        <DemoSection onBack={handleBackToHome} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative text-slate-900 dark:text-white">
      {/* Unified Background with smooth gradients */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-50 via-blue-50/30 via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:via-indigo-950/15 dark:to-slate-900 -z-10"></div>
      
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 dark:opacity-15 -z-10"></div>
      
      {/* Floating Gradient Blobs */}
      <div className="hidden md:block fixed top-20 -left-40 w-64 h-64 bg-blue-300/8 rounded-full mix-blend-multiply filter blur-lg -z-10"></div>
      <div className="hidden lg:block fixed top-1/3 right-0 w-72 h-72 bg-indigo-300/8 rounded-full mix-blend-multiply filter blur-lg -z-10"></div>
      
      {/* Critical above-the-fold content */}
      <Navbar bookingToken={bookingToken} />
      <HeroSection onShowDemo={handleShowDemo} bookingToken={bookingToken} />
      
      {/* Below-the-fold content with Suspense boundaries */}
        <CoreValueSection />
      
        <PMSIntegrationSection />
      
        <PilotResultsSection />
      
        <FAQSection />
      
      <CTA />
      <Footer />
 
    </div>
  );
}
