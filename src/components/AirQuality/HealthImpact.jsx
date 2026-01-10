/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { calculateHealthImpact, getHealthNarrative } from '../../utils/healthImpact';

const HealthImpact = ({ pm25, exposureHours = 24, activityMultiplier = 1, className = "" }) => {
  const impact = calculateHealthImpact(pm25, exposureHours, activityMultiplier);
  const narrative = getHealthNarrative(impact);

  // Don't render if there's an error or invalid data
  if (impact.error || !pm25) return null;

  // Enhanced color schemes with gradients
  const colorSchemes = {
    green: {
      gradient: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700',
      glow: 'shadow-emerald-200/50',
      iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      ring: 'ring-emerald-500/20'
    },
    yellow: {
      gradient: 'from-amber-400 to-orange-500',
      lightBg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-700',
      glow: 'shadow-amber-200/50',
      iconBg: 'bg-gradient-to-br from-amber-100 to-orange-100',
      ring: 'ring-amber-500/20'
    },
    orange: {
      gradient: 'from-orange-500 to-red-500',
      lightBg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      badge: 'bg-orange-100 text-orange-700',
      glow: 'shadow-orange-200/50',
      iconBg: 'bg-gradient-to-br from-orange-100 to-red-100',
      ring: 'ring-orange-500/20'
    },
    red: {
      gradient: 'from-red-500 to-rose-600',
      lightBg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      badge: 'bg-red-100 text-red-700',
      glow: 'shadow-red-200/50',
      iconBg: 'bg-gradient-to-br from-red-100 to-rose-100',
      ring: 'ring-red-500/20'
    }
  };

  const colors = colorSchemes[impact.severityColor];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 ${className}`}
    >
      {/* Premium Header with Gradient */}
      <div className={`bg-gradient-to-r ${colors.gradient} px-6 py-5 relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-2xl">{impact.icon}</span>
            </div>
            <h2 className="font-bold text-xl text-white tracking-tight">
              Health Impact Analysis
            </h2>
          </div>
          <motion.span 
            animate={pulseAnimation}
            className="bg-white/25 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-white border border-white/30"
          >
            {impact.riskLevel}
          </motion.span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-6">
        
        {/* Impact Headline */}
        <motion.div variants={itemVariants} className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {narrative.headline}
          </h3>
        </motion.div>

        {/* Premium Metrics Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Cigarettes Metric Card */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative ${colors.lightBg} rounded-2xl p-6 border ${colors.border} overflow-hidden group`}
          >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/60 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-4xl">🚬</span>
              </div>
              <div className={`text-4xl md:text-5xl font-black text-gray-900 mb-1 tabular-nums`}>
                {impact.cigarettesSmoked}
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Cigarettes Equivalent
              </div>
            </div>
          </motion.div>

          {/* Time Lost Metric Card */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative ${colors.lightBg} rounded-2xl p-6 border ${colors.border} overflow-hidden group`}
          >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/60 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-4xl">⏱️</span>
              </div>
              <div className={`text-4xl md:text-5xl font-black text-gray-900 mb-1 tabular-nums`}>
                {impact.lifeLostHours > 0 
                  ? `${impact.lifeLostHours}h ${impact.lifeLostRemainingMinutes}m`
                  : `${impact.lifeLostRemainingMinutes}m`
                }
              </div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Life Expectancy Lost
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Impact Description Card */}
        <motion.div 
          variants={itemVariants}
          className={`relative ${colors.lightBg} rounded-xl p-5 border-l-4 ${colors.border} overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <p className="text-gray-700 leading-relaxed relative z-10">
            {narrative.subtext}
          </p>
        </motion.div>

        {/* Recommendation Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-primary/5 to-teal-50 rounded-xl p-5 border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <span className="font-bold text-primary text-sm uppercase tracking-wide">Recommendation</span>
              <p className="text-gray-700 mt-1 leading-relaxed">
                {narrative.advice}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scientific Reference - Refined */}
        <motion.div 
          variants={itemVariants}
          className="bg-gray-50 rounded-xl p-5 border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
              <span className="text-sm">📊</span>
            </div>
            <span className="font-semibold text-gray-800 text-sm">Scientific Basis</span>
            <span className="text-gray-400 text-xs">• Berkeley Earth Study</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>22 µg/m³ PM2.5 (24h) = 1 cigarette</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>1 cigarette = 11 min life lost</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>Current: {impact.pm25Input} µg/m³ ({exposureHours}h)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HealthImpact;
