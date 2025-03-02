"use client";
import { cn } from "../../lib/utils.js";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <main>
      <style>
        {`
          @keyframes aurora {
            from {
              background-position: 50% 50%, 50% 50%;
            }
            to {
              background-position: 350% 50%, 350% 50%;
            }
          }
          .aurora {
            animation: aurora 60s linear infinite;
            background-image: var(--white-gradient), var(--aurora);
            background-size: 300%, 200%;
            background-position: 50% 50%, 50% 50%;
          }
          :root {
            --white: #ffffff;
            --black: #000000;
            --blue-500: #3b82f6;
            --indigo-300: #6d28d9;
            --blue-300: #60a5fa;
            --violet-200: #e0aaff;
            --blue-400: #3b82f6;
            --transparent: transparent;
          }
        `}
      </style>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              `
              [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
              [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
              [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
              filter blur-[10px] invert dark:invert-0
              after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
              after:dark:[background-image:var(--dark-gradient),var(--aurora)]
              after:[background-size:200%,100%] 
              after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
              pointer-events-none
              absolute -inset-[10px] opacity-50 will-change-transform aurora`,
              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
