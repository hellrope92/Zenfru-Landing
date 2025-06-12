"use client";
import React from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { BeamsBackground } from "./ui/beams-background";

const CTA = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* CTA Card - 80% width with rounded corners */}
        <div className="relative w-full md:w-[80%] mx-auto rounded-3xl overflow-hidden">
          {/* BeamsBackground */}
          <BeamsBackground 
            className="absolute inset-0 min-h-full" 
            intensity="medium"
          />
          
          {/* Content */}
          <div className="relative z-20 py-20 px-8 sm:px-12 lg:px-16">
            <div className="text-center">
              {/* Badge */}
            
              
              {/* Main Heading */}
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-none tracking-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                  Dental Practice
                </span>
              </h2>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                Experience the future of dental reception with our AI-powered system that 
                <span className="text-blue-400 font-medium"> increases bookings by 40%</span> while your team focuses on patient care.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  href="/demo"
                  className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-2xl hover:from-blue-500 hover:via-purple-500 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 min-w-[240px] overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                  
                  <span className="relative z-10 flex items-center">
                    See It In Action
                    <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
                
                <Link
                  href="/pricing"
                  className="group inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-gray-300 border-2 border-gray-600 rounded-2xl hover:border-blue-400 hover:text-white hover:bg-blue-950/30 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 backdrop-blur-sm min-w-[240px]"
                >
                  Get In Touch
                  <svg className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>      
      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default CTA;
