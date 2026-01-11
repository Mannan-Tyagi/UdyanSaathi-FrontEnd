import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

/**
 * GridBackground - A subtle animated grid background component
 * Used to maintain visual consistency across the entire page
 */
export const GridBackground = ({ 
  children, 
  className,
  showGlows = true,
  intensity = "light" // "light" | "medium" | "strong"
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

  const speedX = 0.3; 
  const speedY = 0.3;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  const opacityMap = {
    light: { base: "opacity-[0.03]", hover: "opacity-20" },
    medium: { base: "opacity-[0.05]", hover: "opacity-30" },
    strong: { base: "opacity-[0.08]", hover: "opacity-40" }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("relative w-full", className)}
    >
      {/* Static Background Grid */}
      <div className={cn("absolute inset-0 z-0 pointer-events-none", opacityMap[intensity].base)}>
        <GridPatternStatic offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      
      {/* Mouse-following Grid - Interactive layer */}
      <motion.div 
        className={cn("absolute inset-0 z-0 pointer-events-none", opacityMap[intensity].hover)}
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPatternStatic offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* Ambient Glow Effects */}
      {showGlows && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute right-[-10%] top-[10%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute left-[-5%] top-[40%] w-[25%] h-[25%] rounded-full bg-blue-500/8 blur-[80px]" />
          <div className="absolute right-[20%] bottom-[10%] w-[20%] h-[20%] rounded-full bg-emerald-500/10 blur-[60px]" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const GridPatternStatic = ({ offsetX, offsetY }) => {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern-bg"
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
      <rect width="100%" height="100%" fill="url(#grid-pattern-bg)" />
    </svg>
  );
};

export default GridBackground;
