import React from 'react';
import Orb from './orb';
import Link from 'next/link';

interface HeroSectionProps {
  onShowDemo: () => void;
}

export default function HeroSection({ onShowDemo }: HeroSectionProps) {
  return (
  <section className="relative min-h-screen max-w-100vw bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950/20 overflow-hidden pt-32 pb-12">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.4%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40 dark:opacity-20"></div>
      
      {/* Floating Orb Background */}
  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-40 dark:opacity-25 pointer-events-none">
        <Orb hue={50} hoverIntensity={0.2} rotateOnHover={true} forceHoverState={true} />
      </div>

      {/* Gradient Blobs */}
      <div className="absolute top-20 -left-40 w-80 h-80 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-xl animate-blob-float"></div>
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-xl animate-blob-float-reverse"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Status Badge */}
        {/**
        <div className="mb-8 animate-fade-in-up mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300 ">
              Available 24/7 
            </span>
          </div>
        </div>
        */}

        {/* Main Heading */}
        <div className="mb-8 animate-fade-in-up animation-delay-200">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            <span className="block mb-2">Never Miss a</span>
            <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Client Call
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mt-2 text-slate-700 dark:text-slate-300 font-light italic">
              Again.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className="mb-12 animate-fade-in-up animation-delay-400">
          <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-400 sm:text-2xl leading-relaxed">
            AI-powered virtual front desk that <span className="text-blue-600 dark:text-blue-400 font-semibold"> handles appointments, </span> 
            <span className="text-blue-600 dark:text-blue-400 font-semibold"> books clients</span>, and 
            <span className="text-blue-600 dark:text-blue-400 font-semibold"> manages calls</span> when your staff is away
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mb-16 animate-fade-in-up animation-delay-600">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-smooth duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 min-w-[200px] text-lg">
              <Link 
              href="https://calendly.com/kay-zenfru"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Call
            </Link>
            </button>
            
            <button 
              onClick={onShowDemo}
              className="group px-10 py-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-blue-500 dark:border-indigo-500 text-blue-600 dark:text-indigo-400 font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-smooth duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-indigo-400 focus:ring-opacity-50 min-w-[200px] text-lg"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch in Action
              </span>
            </button>
          </div>
        </div>

  {/* Industry Buttons and Subtypes */}
  <div className="animate-fade-in-up animation-delay-800 mt-32 w-full">
          <div className="flex flex-row flex-wrap justify-center gap-8 w-full">
            {/* Clinics */}
            <div className="flex flex-col items-start w-56">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-semibold text-black-700 dark:text-black-300 text-left">Clinics</span>
                {/* Stethoscope SVG icon */}
                <span className="w-6 h-6 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2563eb" viewBox="0 0 256 256">
                    <path d="M220,160a12,12,0,1,1-12-12A12,12,0,0,1,220,160Zm-4.55,39.29A48.08,48.08,0,0,1,168,240H144a48.05,48.05,0,0,1-48-48V151.49A64,64,0,0,1,40,88V40a8,8,0,0,1,8-8H72a8,8,0,0,1,0,16H56V88a48,48,0,0,0,48.64,48c26.11-.34,47.36-22.25,47.36-48.83V48H136a8,8,0,0,1,0-16h24a8,8,0,0,1,8,8V87.17c0,32.84-24.53,60.29-56,64.31V192a32,32,0,0,0,32,32h24a32.06,32.06,0,0,0,31.22-25,40,40,0,1,1,16.23.27ZM232,160a24,24,0,1,0-24,24A24,24,0,0,0,232,160Z"></path>
                  </svg>
                </span>
              </div>
              <ul className="text-slate-600 dark:text-slate-400 text-left text-lg pl-0">
                <li className="list-none">- Dental</li>
                <li className="list-none">- Vets</li>
                <li className="list-none">- Specialists</li>
                <li className="list-none">- General Physicians</li>
                <li className="list-none">- Other Practitioners</li>
              </ul>
            </div>
            {/* Home Services */}
            <div className="flex flex-col items-start w-56">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-semibold text-black-700 dark:text-black-300 text-left">Home Services</span>
                {/* Home SVG icon */}
                <span className="w-6 h-6 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2563eb" viewBox="0 0 256 256">
                    <path d="M240,208H224V136l2.34,2.34A8,8,0,0,0,237.66,127L139.31,28.68a16,16,0,0,0-22.62,0L18.34,127a8,8,0,0,0,11.32,11.31L32,136v72H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM48,120l80-80,80,80v88H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48Zm96,88H112V160h32Z"></path>
                  </svg>
                </span>
              </div>
              <ul className="text-slate-600 dark:text-slate-400 text-left text-lg pl-0">
                <li className="list-none">- HVAC</li>
                <li className="list-none">- Plumbing</li>
                <li className="list-none">- Electrical</li>
                <li className="list-none">- Landscaping</li>
                <li className="list-none">- Roofing</li>
                <li className="list-none">- Cleaning</li>
                <li className="list-none">- Pest Control</li>
              </ul>
            </div>
            {/* Auto Services */}
            <div className="flex flex-col items-start w-56">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-semibold text-black-700 dark:text-black-300 text-left">Auto Services</span>
                {/* Car SVG icon */}
                <span className="w-6 h-6 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2563eb" viewBox="0 0 256 256">
                    <path d="M240,112H211.31L168,68.69A15.86,15.86,0,0,0,156.69,64H44.28A16,16,0,0,0,31,71.12L1.34,115.56A8.07,8.07,0,0,0,0,120v48a16,16,0,0,0,16,16H33a32,32,0,0,0,62,0h66a32,32,0,0,0,62,0h17a16,16,0,0,0,16-16V128A16,16,0,0,0,240,112ZM44.28,80H156.69l32,32H23ZM64,192a16,16,0,1,1,16-16A16,16,0,0,1,64,192Zm128,0a16,16,0,1,1,16-16A16,16,0,0,1,192,192Zm48-24H223a32,32,0,0,0-62,0H95a32,32,0,0,0-62,0H16V128H240Z"></path>
                  </svg>
                </span>
              </div>
              <ul className="text-slate-600 dark:text-slate-400 text-left text-lg pl-0">
                <li className="list-none">- Auto repair shops</li>
                <li className="list-none">- Dealership service centers</li>
                <li className="list-none">- Tire shops</li>
              </ul>
            </div>
            {/* Personal Care Services */}
            <div className="flex flex-col items-start w-56">
              <div className="flex items-center gap-2 mb-2" style={{ marginLeft: '-8px', marginRight: '-8px' }}>
                <span className="text-xl font-semibold text-black-700 dark:text-black-300 text-left">Grooming Services</span>
                {/* Scissors SVG icon */}
                <span className="w-6 h-6 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2563eb" viewBox="0 0 256 256">
                    <path d="M157.73,113.13A8,8,0,0,1,159.82,102L227.48,55.7a8,8,0,0,1,9,13.21l-67.67,46.3a7.92,7.92,0,0,1-4.51,1.4A8,8,0,0,1,157.73,113.13Zm80.87,85.09a8,8,0,0,1-11.12,2.08L136,137.7,93.49,166.78a36,36,0,1,1-9-13.19L121.83,128,84.44,102.41a35.86,35.86,0,1,1,9-13.19l143,97.87A8,8,0,0,1,238.6,198.22ZM80,180a20,20,0,1,0-5.86,14.14A19.85,19.85,0,0,0,80,180ZM74.14,90.13a20,20,0,1,0-28.28,0A19.85,19.85,0,0,0,74.14,90.13Z"></path>
                  </svg>
                </span>
              </div>
              <ul className="text-slate-600 dark:text-slate-400 text-left text-lg pl-0">
                <li className="list-none">- Salons</li>
                <li className="list-none">- Spas</li>
                <li className="list-none">- Barbershops</li>
                <li className="list-none">- Nail salons</li>
                <li className="list-none">- Pet grooming</li>
              </ul>
            </div>
            {/* Fitness & Wellness */}
            <div className="flex flex-col items-start w-56 ml-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-semibold text-black-700 dark:text-black-300 text-left">Fitness & Wellness</span>
                {/* Dumbbell SVG icon */}
                <span className="w-6 h-6 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#2563eb" viewBox="0 0 256 256">
                    <path d="M248,120h-8V88a16,16,0,0,0-16-16H208V64a16,16,0,0,0-16-16H168a16,16,0,0,0-16,16v56H104V64A16,16,0,0,0,88,48H64A16,16,0,0,0,48,64v8H32A16,16,0,0,0,16,88v32H8a8,8,0,0,0,0,16h8v32a16,16,0,0,0,16,16H48v8a16,16,0,0,0,16,16H88a16,16,0,0,0,16-16V136h48v56a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16v-8h16a16,16,0,0,0,16-16V136h8a8,8,0,0,0,0-16ZM32,168V88H48v80Zm56,24H64V64H88V192Zm104,0H168V64h24V175.82c0,.06,0,.12,0,.18s0,.12,0,.18V192Zm32-24H208V88h16Z"></path>
                  </svg>
                </span>
              </div>
              <ul className="text-slate-600 dark:text-slate-400 text-left text-lg pl-0">
                <li className="list-none">- Gyms</li>
                <li className="list-none">- Personal trainers</li>
                <li className="list-none">- Yoga studios</li>
                <li className="list-none">- Wellness centers</li>
                <li className="list-none">- Dance studios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
    </section>
  );
}