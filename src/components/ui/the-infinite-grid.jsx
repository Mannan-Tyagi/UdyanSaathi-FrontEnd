import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

export const TheInfiniteGrid = ({ 
  title = "The Infinite Grid",
  subtitle = "Move your cursor to reveal the active grid layer.",
  children,
  className,
  showDefaultContent = true,
  primaryGlowColor = "bg-primary/40 dark:bg-primary/20",
  secondaryGlowColor = "bg-blue-500/40 dark:bg-blue-600/20",
  accentGlowColor = "bg-orange-500/40 dark:bg-orange-600/20"
}) => {
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5; 
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full flex flex-col items-center justify-center overflow-hidden bg-canvas",
        className
      )}
    >
      {/* Background Grid - Static layer */}
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      
      {/* Mouse-following Grid - Interactive layer */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* Ambient Glow Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className={cn("absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full blur-[120px]", accentGlowColor)} />
        <div className={cn("absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full blur-[100px]", primaryGlowColor)} />
        <div className={cn("absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full blur-[120px]", secondaryGlowColor)} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto space-y-6 pointer-events-none">
        {showDefaultContent && (
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-ink drop-shadow-sm">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-metal">
              {subtitle}
            </p>
          </div>
        )}
        
        {/* Custom content from children */}
        {children && (
          <div className="pointer-events-auto w-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

const GridPattern = ({ offsetX, offsetY }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="infinite-grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-metal" 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#infinite-grid-pattern)" />
    </svg>
  );
};

export default TheInfiniteGrid;
