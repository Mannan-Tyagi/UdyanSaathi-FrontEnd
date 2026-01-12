/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { calculateHealthImpact, getHealthNarrative } from '../../utils/healthImpact';

const HealthImpact = ({ pm25, exposureHours = 24, activityMultiplier = 1, className = "" }) => {
  const impact = calculateHealthImpact(pm25, exposureHours, activityMultiplier);
  const narrative = getHealthNarrative(impact);

  // Don't render if there's an error or invalid data
  if (impact.error || !pm25) return null;

  // Professional, muted color schemes aligned with design system
  const colorSchemes = {
    green: {
      headerBg: 'bg-gradient-to-r from-primary-500 to-primary-600',
      statusBg: 'bg-status-good/10',
      statusText: 'text-status-good',
      statusBorder: 'border-status-good/20',
      accentDot: 'bg-status-good',
    },
    yellow: {
      headerBg: 'bg-gradient-to-r from-primary-500 to-primary-600',
      statusBg: 'bg-status-moderate/10',
      statusText: 'text-status-moderate',
      statusBorder: 'border-status-moderate/20',
      accentDot: 'bg-status-moderate',
    },
    orange: {
      headerBg: 'bg-gradient-to-r from-primary-500 to-primary-600',
      statusBg: 'bg-status-moderate/10',
      statusText: 'text-status-moderate',
      statusBorder: 'border-status-moderate/20',
      accentDot: 'bg-status-moderate',
    },
    red: {
      headerBg: 'bg-gradient-to-r from-primary-500 to-primary-600',
      statusBg: 'bg-status-critical/10',
      statusText: 'text-status-critical',
      statusBorder: 'border-status-critical/20',
      accentDot: 'bg-status-critical',
    }
  };

  const colors = colorSchemes[impact.severityColor];

  // Subtle animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-soft border border-mist overflow-hidden ${className}`}
    >
      {/* Clean Header - Unified Blue Theme */}
      <div className={`${colors.headerBg} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-white text-base">Health Impact Analysis</h2>
              <p className="text-white/70 text-xs">Based on PM2.5 exposure data</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.statusBg} ${colors.statusText} border ${colors.statusBorder}`}>
            {impact.riskLevel}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-5">
        
        {/* Metrics Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
          
          {/* Cigarettes Metric */}
          <div className="bg-canvas rounded-xl p-5 border border-mist">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-xl border border-mist flex items-center justify-center mb-3 shadow-soft-xs">
                <svg className="w-6 h-6 text-metal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.5 8.5c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5M12.5 8.5V6m0 0c0-1.66-1.34-3-3-3S6.5 4.34 6.5 6v2.5m0 0h12v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-ink tabular-nums tracking-tight">
                {impact.cigarettesSmoked}
              </div>
              <div className="text-xs text-metal mt-1 font-medium">
                Cigarettes Equivalent
              </div>
            </div>
          </div>

          {/* Time Lost Metric */}
          <div className="bg-canvas rounded-xl p-5 border border-mist">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-white rounded-xl border border-mist flex items-center justify-center mb-3 shadow-soft-xs">
                <svg className="w-6 h-6 text-metal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-ink tabular-nums tracking-tight">
                {impact.lifeLostHours > 0 
                  ? `${impact.lifeLostHours}h ${impact.lifeLostRemainingMinutes}m`
                  : `${impact.lifeLostRemainingMinutes}m`
                }
              </div>
              <div className="text-xs text-metal mt-1 font-medium">
                Life Expectancy Lost
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact Message */}
        <motion.div 
          variants={itemVariants}
          className={`rounded-xl p-4 border-l-3 ${colors.statusBg} ${colors.statusBorder} border`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 ${colors.accentDot} rounded-full mt-1.5 flex-shrink-0`}></div>
            <p className="text-sm text-ink leading-relaxed">
              {narrative.subtext}
            </p>
          </div>
        </motion.div>

        {/* Recommendation */}
        <motion.div 
          variants={itemVariants}
          className="bg-primary-50 rounded-xl p-4 border border-primary-100"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-white rounded-lg border border-primary-200 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-primary text-xs uppercase tracking-wider">Recommendation</span>
              <p className="text-sm text-ink mt-1 leading-relaxed">
                {narrative.advice}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scientific Reference - Compact Footer */}
        <motion.div 
          variants={itemVariants}
          className="pt-4 border-t border-mist"
        >
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-ink text-xs">Scientific Basis</span>
            <span className="text-muted text-xs">• Berkeley Earth Study</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-xs text-metal">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>22 µg/m³ PM2.5 (24h) = 1 cigarette</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-metal">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <span>1 cigarette = 11 min life lost</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-metal">
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
