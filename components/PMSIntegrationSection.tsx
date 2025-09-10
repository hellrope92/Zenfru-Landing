"use client";

import React, { useRef, useEffect } from 'react';

// Custom hook for scroll reveal
function useScrollReveal<T extends HTMLElement = HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('visible');
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);
  return ref;
}

const PMSIntegrationSection = () => {
  const pmsProviders = [
    {
      name: "HubSpot",
      logo: "/logos/hubspot.png",
      alt: "HubSpot CRM Software"
    },
    {
      name: "Dentrix",
      logo: "/logos/dentrix.png",
      alt: "Dentrix Practice Management Software"
    },
    {
      name: "Eaglesoft",
      logo: "/logos/eaglesoft.png", 
      alt: "Eaglesoft Practice Management Software"
    },
    {
      name: "zendesk",
      logo: "/logos/zendesk.png",
      alt: "Zendesk Customer Service Software"
    },
    {
      name: "OpenDental",
      logo: "/logos/opendental.png",
      alt: "OpenDental Practice Management Software"
    },
    {
      name: "Weave",
      logo: "/logos/weave.png",
      alt: "Weave Practice Management Platform"
    },
    {
      name: "Housecall Pro",
      logo: "/logos/housecallpro.png",
      alt: "Housecall Pro Practice Management Software"
    },
    {
      name: "Softdent",
      logo: "/logos/softdent.png",
      alt: "Softdent Practice Management Software"
    },
    {
      name: "Zoho CRM",
      logo: "/logos/zoho.png",
      alt: "Zoho CRM Software"
    },
    {
      name: "Mindbody",
      logo: "/logos/mindbody.png",
      alt: "Mindbody Wellness Software"
    }
  ];  
  const headingRef = useScrollReveal<HTMLHeadingElement>();
  const subtitleRef = useScrollReveal<HTMLParagraphElement>({ rootMargin: '-40px' });
  const whyHeadingRef = useScrollReveal<HTMLHeadingElement>({ rootMargin: '-40px' });
  const whySubtitleRef = useScrollReveal<HTMLParagraphElement>({ rootMargin: '-40px' });
  const benefitRefs = [useScrollReveal<HTMLDivElement>(), useScrollReveal<HTMLDivElement>(), useScrollReveal<HTMLDivElement>()];

  return (
    <section id="integration" className="py-16 md:py-24 max-w-100vw relative w-full max-w-full overflow-hidden">
      <div className="container mx-auto px-6 md:px-8 relative z-10 max-w-7xl">
        <div className="text-center mb-16">
          <h2 ref={headingRef} className="fade-in-up-on-scroll text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
            Integrates seamlessly with
            <span className="block text-blue-600 font-bold">your existing workflow</span>
          </h2>
          <p ref={subtitleRef} className="fade-in-up-on-scroll text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect with your current CRM, PMS or custom database system with ease.
            Zero disruption, maximum enhancement.
          </p>
        </div>
        {/* Marquee Animation */}
        <div className="relative w-full max-w-full overflow-hidden">
          <div className="flex space-x-16 animate-marquee-fast">
            {/* First set of logos */}
            {pmsProviders.map((provider, index) => (
              <div
                key={`first-${index}`}
                className="flex-none flex items-center justify-center"
              >
                <img
                  src={provider.logo}
                  alt={provider.alt}
                  className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                />
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {pmsProviders.map((provider, index) => (
              <div
                key={`second-${index}`}
                className="flex-none flex items-center justify-center"
              >
                <img
                  src={provider.logo}
                  alt={provider.alt}
                  className="h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Integration Benefits */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 ref={whyHeadingRef} className="fade-in-up-on-scroll text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
              <span className="block text-blue-600 font-bold">Why services like Zenfru?</span>
            </h2>
            <p ref={whySubtitleRef} className="fade-in-up-on-scroll text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              For teams that put their clients first, even when their staff has signed off.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[0,1,2].map(i => (
              <div ref={benefitRefs[i]} key={i} className="fade-in-up-on-scroll group">
                {i === 0 && (
                  <><div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-all duration-300">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Quick setup</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Simple setup that works with your existing workflow. No IT department required.
                  </p></>) }
                {i === 1 && (
                  <><div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-all duration-300">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Live synchronization</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Client appointments and data sync in real-time. Your team sees updates instantly.
                  </p></>) }
                {i === 2 && (
                  <><div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-all duration-300">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Enterprise security</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Legally-compliant architecture with end-to-end encryption. Your client data stays protected.
                  </p></>) }
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PMSIntegrationSection;
