"use client";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "spotlight-card relative overflow-hidden rounded-3xl p-6 border transition-all duration-300",
        "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700",
        "hover:scale-[1.015] shadow-xl hover:shadow-2xl will-change-transform",
        className
      )}
    >
      <style jsx>{`
        .spotlight-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          pointer-events: none;
          background: radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(59, 130, 246, 0.15),
            transparent 80%
          );
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
          z-index: 0;
        }

        .spotlight-card:hover::before {
          opacity: 1;
        }

        .spotlight-card > * {
          position: relative;
          z-index: 1;
        }
      `}</style>
      {children}
    </div>
  );
};
