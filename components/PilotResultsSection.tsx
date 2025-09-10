"use client";
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { CheckCircle, TrendingUp, Phone, Clock, Target } from 'lucide-react';

// Animation hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { 
      threshold: 0.2, 
      rootMargin: '-50px 0px -50px 0px',
      ...options 
    });

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return [elementRef, isVisible] as const;
};

const heroStats = [
  {
    label: 'Monthly Revenue Growth',
    value: '10-15%',
    color: 'text-blue-600',
    icon: <TrendingUp className="h-12 w-12 text-blue-500" />,
    description: 'Significant increase in monthly revenues through improved call handling and client retention',
    badge: 'Revenue Growth'
  },
  {
    label: 'Monthly Profit Increase',
    value: '20-25%',
    color: 'text-blue-600',
    icon: <TrendingUp className="h-12 w-12 text-indigo-500" />,
    description: 'Enhanced profitability by reducing missed opportunities and optimizing staff efficiency',
    badge: 'Profit Boost'
  },
  
  {
    label: 'Missed Call Reduction',
    value: '~100%',
    color: 'text-blue-600',
    icon: <CheckCircle className="h-12 w-12 text-indigo-500" />,
    description: 'Substantial reduction in missed calls leading to better client satisfaction and retention',
    badge: 'Call Management'
  },
  {
    label: 'Missed Opportunities',
    value: '0',
    color: 'text-blue-600',
    icon: <Target className="h-12 w-12 text-blue-500" />,
    description: 'No missed opportunities during the pilot, ensuring every potential client was engaged',
    badge: 'Opportunity Capture'
  },
];

const lowerStats = [
  {
    label: 'Calls answered',
    value: '100%',
    color: 'from-blue-600 to-indigo-600',
    icon: <Phone className="h-8 w-8 text-white" />,
    sub: 'Perfect call handling'
  },
  {
    label: 'Availability',
    value: '24/7',
    color: 'from-blue-500 to-indigo-500',
    icon: <Clock className="h-8 w-8 text-white" />,
    sub: 'Always available'
  },
  {
    label: 'Missed opportunities',
    value: 'Zero',
    color: 'from-indigo-500 to-blue-500',
    icon: <CheckCircle className="h-8 w-8 text-white" />,
    sub: 'Complete coverage'
  },
];

const PilotResultsSection = () => {
  const [sectionRef, isSectionVisible] = useIntersectionObserver();
  const [statsRef, isStatsVisible] = useIntersectionObserver();

  return (
    <section ref={sectionRef} id="results" className="py-16 relative bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl animate-float-reverse"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col md:flex-row items-stretch md:items-stretch gap-10 mb-16 transition-all duration-1000 ${
          isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Image Section */}
          <div className={`flex-1 w-full transition-all duration-700 delay-200 ${
            isSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>            <div className="bg-white rounded-2xl shadow-lg border p-4 md:p-6 h-full flex items-center group hover:shadow-xl transition-all duration-500">
              <div className="relative overflow-hidden rounded-xl w-full aspect-[4/3]">
                <Image
                  src="/Zenfru5.png"
                  alt="Pilot program dashboard"
                  fill
                  className="object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rp9fM2sLZX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rp9fM2sLZX2lYlFcDm1e+zPANCIJD4CdXMmMOI+GbJ6WuNgYFU0k0bC8t5Y9vgKZbp5VxUy1BEhMU31/mP+sTpS81mAGrEKw2O4a5Bb8nXdGhI5jDJAAJJAJYYABJHwI+HQJgIJ8H4HX//9k="                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className={`flex-1 w-full flex flex-col justify-center transition-all duration-700 delay-400 ${
            isSectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 text-center md:text-left animate-gradient bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 bg-clip-text">
              Our Results
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full flex-1">
              {heroStats.map((stat, i) => (
                <div 
                  key={i} 
                  className={`flex items-center gap-3 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl shadow p-4 border border-blue-200/30 hover:shadow-lg hover:scale-105 transition-all duration-500 h-full group cursor-pointer transform ${
                    isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${600 + i * 100}ms` }}
                >
                  <div className="shrink-0 p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {React.cloneElement(stat.icon, { 
                        className: "h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" 
                      })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-2xl font-extrabold ${stat.color} leading-none group-hover:scale-110 transition-transform duration-300 origin-left`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-700 transition-colors duration-300">
                      {stat.label}
                    </div>
                  
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>        
        {/* Achievement Stats Bar */}
        <div 
          ref={statsRef}
          className={`bg-white rounded-2xl shadow-lg border border-blue-100/50 p-8 backdrop-blur-sm relative overflow-hidden transition-all duration-1000 hidden ${
            isStatsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 transform -skew-x-12 -translate-x-full animate-shimmer"></div>
          
          <div className={`text-center mb-8 transition-all duration-700 delay-200 ${
            isStatsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h3 className="text-2xl font-bold text-slate-800 mb-2 bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Key Performance Indicators
            </h3>
            <p className="text-slate-600">Measurable improvements across all metrics</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {lowerStats.map((stat, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-4 group cursor-pointer transition-all duration-700 hover:scale-105 ${
                  isStatsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: `${400 + i * 200}ms` }}
              >
                {/* Icon Circle */}
                <div className={`relative p-4 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:rotate-6`}>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  <div className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-left">
                  <div className="text-3xl font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-110 origin-left">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-slate-700 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                    {stat.label}
                  </div>
                  <div className="text-sm text-slate-500 font-medium group-hover:text-slate-600 transition-colors duration-300">
                    {stat.sub}
                  </div>
                </div>
                
                {/* Connector Line (except for last item) */}
                {i < lowerStats.length - 1 && (
                  <div className={`hidden md:block w-16 h-px bg-gradient-to-r from-blue-200 to-indigo-200 mx-4 relative overflow-hidden transition-all duration-700 ${
                    isStatsVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                  }`} style={{ transitionDelay: `${800 + i * 200}ms` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 transform -translate-x-full animate-line-flow"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PilotResultsSection;
