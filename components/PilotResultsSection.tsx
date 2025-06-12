"use client";
import React from 'react';
import Image from 'next/image';

const PilotResultsSection = () => {  return (
    <section id="results" className="py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Early results from our pilot
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Simple improvements that made an immediate difference
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <Image
              src="/Zenfru5.png"
              alt="Pilot program dashboard"
              width={800}
              height={500}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-slate-600">Calls answered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-slate-600">Always available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">Zero</div>
              <div className="text-slate-600">Missed opportunities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PilotResultsSection;
