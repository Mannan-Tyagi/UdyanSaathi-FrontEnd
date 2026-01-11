import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { 
  motion, 
  useMotionValue, 
  useMotionTemplate, 
  useAnimationFrame 
} from "framer-motion";

/**
 * UnifiedPageBackground - A seamless animated grid background for the entire page
 * Eliminates visual breaks between sections
 */
export const UnifiedPageBackground = ({ 
  children, 
  className
}) => {
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top + window.scrollY);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.4; 
  const speedY = 0.4;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative min-h-screen w-full overflow-x-hidden",
        className
      )}
      style={{
        background: "linear-gradient(180deg, #F0FDFA 0%, #F1F5F9 15%, #F8FAFC 50%, #F1F5F9 100%)"
      }}
    >
      {/* Base Grid Pattern - Very subtle, always visible */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none">
        <GridPatternSVG offsetX={gridOffsetX} offsetY={gridOffsetY} id="base-grid" />
      </div>
      
      {/* Interactive Grid - Follows mouse */}
      <motion.div 
        className="fixed inset-0 z-0 opacity-30 pointer-events-none"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPatternSVG offsetX={gridOffsetX} offsetY={gridOffsetY} id="interactive-grid" />
      </motion.div>

      {/* Ambient Gradient Glows - Fixed position for consistency */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top right - Teal glow */}
        <div className="absolute -right-[10%] -top-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-400/10 blur-[120px]" />
        
        {/* Top left - Blue accent */}
        <div className="absolute -left-[5%] top-[5%] w-[30%] h-[30%] rounded-full bg-blue-400/10 blur-[100px]" />
        
        {/* Middle right - Primary glow */}
        <div className="absolute right-[10%] top-[40%] w-[25%] h-[25%] rounded-full bg-primary/10 blur-[80px]" />
        
        {/* Bottom left - Emerald glow */}
        <div className="absolute -left-[5%] bottom-[20%] w-[35%] h-[35%] rounded-full bg-emerald-400/15 blur-[100px]" />
        
        {/* Bottom right - Subtle blue */}
        <div className="absolute right-[5%] bottom-[10%] w-[20%] h-[20%] rounded-full bg-blue-400/8 blur-[60px]" />
      </div>

      {/* Page Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const GridPatternSVG = ({ offsetX, offsetY, id }) => {
  return (
    <svg className="w-full h-full" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <motion.pattern
          id={id}
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
            className="text-slate-500" 
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

export default UnifiedPageBackground;
