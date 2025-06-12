"use client";
import React from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion'; // Import motion and useAnimation
import { useInView } from 'react-intersection-observer'; // Import useInView

const CoreValueSection = () => {
  const features = [
    {
      title: 'Real-time phone handling.',
      description: 'Every call is picked up instantly, with human-like AI that books, reschedules, and provides information.',
      imageSrc: '/Zenfru1.png',
      imageAlt: 'Real-time phone handling illustration',
    },
    {
      title: 'Emergency triage.',
      description: 'Escalations and non-urgent cases are identified and routed seamlessly, day or night.',
      imageSrc: '/Zenfru2.png',
      imageAlt: 'Emergency triage illustration',
    },
    {
      title: 'HIPAA-compliant security.',
      description: 'Patient info stays private with end-to-end encryption and safe data practices.',
      imageSrc: '/Zenfru3.png',
      imageAlt: 'HIPAA-compliant security illustration',
    },
    {
      title: 'Practice Info On-Demand',
      description: 'Instantly provides clinic details (location, hours, insurance) and automatically sends new patient intake forms via text.',
      imageSrc: '/Zenfru4.png', 
      imageAlt: 'Practice info on-demand illustration',
    }
  ];

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  const stickyTopOffset = '100px'; // Defines how far from the top the cards will stick
    return (
    <section id="features" className="py-16 md:py-24 w-full relative">
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase text-blue-600 dark:text-blue-400 font-semibold tracking-wider mb-4"
          >
            Core Value Proposition
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8"
          >
            "Never miss a patient call again — even when you're closed."
          </motion.p>
        </div>

        {/* Container for the sticky cards */}
        <div className="relative max-w-5xl mx-auto"> {/* Removed space-y-*, margin will be on cards now */}
          {features.map((feature, index) => {
            const controls = useAnimation();
            const { ref, inView } = useInView({
              triggerOnce: true, // Only trigger once
              threshold: 0.2, // Trigger when 20% of the element is in view
            });

            React.useEffect(() => {
              if (inView) {
                controls.start("visible");
              } else {
                // Optional: If you want cards to reset animation when scrolled out and back in (and triggerOnce is false)
                // controls.start("hidden"); 
              }
            }, [controls, inView]);

            return (
              <motion.div
                key={index}
                ref={ref}
                initial="hidden"
                animate={controls}
                variants={containerVariants}
                className={`
                  flex flex-col md:flex-row items-center gap-8 md:gap-12 
                  bg-white p-6 md:p-8 rounded-xl shadow-xl
                  ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}
                  mb-24 md:mb-32  // Increased margin-bottom to create scroll space between cards
                `}
                style={{
                  position: 'sticky',
                  top: stickyTopOffset,
                  zIndex: index + 1, // Ensures subsequent cards stack on top
                }}
              >
                {/* Text Content */}
                          <div className="md:w-1/2 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 dark:text-white bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
                {/* Image Content */}
                <div className="md:w-1/2 flex justify-center items-center p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/50 dark:to-indigo-950/50 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 aspect-square max-w-md w-full overflow-hidden group">
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    width={400} 
                    height={400} 
                    className="rounded-lg object-contain transform transition-all duration-700 group-hover:scale-110 filter grayscale-[20%] group-hover:grayscale-0 group-hover:drop-shadow-lg"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreValueSection;