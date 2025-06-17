"use client";
import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DemoSection from "@/components/DemoSection";

// Dynamic imports for sections below the fold
const CoreValueSection = dynamic(() => import("@/components/Features"), {
  loading: () => <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 animate-pulse" />,
  ssr: true,
});

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
  const [showDemo, setShowDemo] = useState(false);

  const handleShowDemo = () => {
    setShowDemo(true);
  };

  const handleBackToHome = () => {
    setShowDemo(false);
  };

  if (showDemo) {
    return (
      <div className="min-h-screen w-full relative text-slate-900 dark:text-white">
        <Navbar />
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
      <div className="fixed top-20 -left-40 w-80 h-80 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob-float -z-10"></div>
      <div className="fixed top-1/3 right-0 w-96 h-96 bg-indigo-300/8 rounded-full mix-blend-multiply filter blur-xl animate-blob-float-reverse animation-delay-2000 -z-10"></div>
      <div className="fixed bottom-1/4 -left-20 w-72 h-72 bg-purple-300/8 rounded-full mix-blend-multiply filter blur-xl animate-blob-float animation-delay-4000 -z-10"></div>
      
      {/* Critical above-the-fold content */}
      <Navbar />
      <HeroSection onShowDemo={handleShowDemo} />
      
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
