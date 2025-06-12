import React from 'react';
import { Component as Orb } from './orb'; // Assuming 'orb.tsx' exports 'Component' as Orb

export default function HeroSection() {
  return (
    <section className="relative min-h-screen max-w-100vw bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/20 overflow-hidden pt-16 pb-12">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 dark:opacity-20"></div>
      
      {/* Floating Orb Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-40 dark:opacity-25 pointer-events-none">
        <Orb hue={220} hoverIntensity={0.6} rotateOnHover={true} forceHoverState={true} />
      </div>

      {/* Gradient Blobs */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-xl animate-blob-float"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-xl animate-blob-float-reverse"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Status Badge */}
        <div className="mb-8 animate-fade-in-up mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300 ">
              Available 24/7 • HIPAA Compliant
            </span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block mb-2">Never Miss a</span>
            <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Patient Call
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mt-2 text-slate-700 dark:text-slate-300 font-light italic">
              Again.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-12 animate-fade-in-up animation-delay-400">
          <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-400 sm:text-2xl leading-relaxed">
            AI-powered virtual front desk that handles appointments, 
            <span className="text-blue-600 dark:text-blue-400 font-semibold"> books patients</span>, and 
            <span className="text-blue-600 dark:text-blue-400 font-semibold"> manages calls</span> when your staff can't
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mb-16 animate-fade-in-up animation-delay-600">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-smooth duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 min-w-[200px] text-lg">
              <span className="relative z-10">Join Waitlist</span>
            </button>
            
            <button className="group px-10 py-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-blue-500 dark:border-indigo-500 text-blue-600 dark:text-indigo-400 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-smooth duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-indigo-400 focus:ring-opacity-50 min-w-[200px] text-lg">
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </span>
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="animate-fade-in-up animation-delay-800">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-x-10 gap-y-6 text-base text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Easy 5-Min Setup</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Fully HIPAA Compliant</span>
            </div>
            
            

            {/* Added Key Benefit: Reduce Staff Load */}
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd"/>
                </svg>
              </div>
              <span>Reduce Staff Workload</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
    </section>
  );
}