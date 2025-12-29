/* eslint-disable react/prop-types */
import { calculateHealthImpact, getHealthNarrative } from '../../utils/healthImpact';

const HealthImpact = ({ pm25, exposureHours = 24, activityMultiplier = 1, className = "" }) => {
  const impact = calculateHealthImpact(pm25, exposureHours, activityMultiplier);
  const narrative = getHealthNarrative(impact);

  // Don't render if there's an error or invalid data
  if (impact.error || !pm25) return null;

  // Color schemes matching your existing design
  const colorSchemes = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      badge: 'bg-green-500',
      headerBg: 'bg-green-500'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-900',
      badge: 'bg-yellow-500',
      headerBg: 'bg-yellow-500'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      text: 'text-orange-900',
      badge: 'bg-orange-500',
      headerBg: 'bg-orange-500'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-900',
      badge: 'bg-red-600',
      headerBg: 'bg-red-600'
    }
  };

  const colors = colorSchemes[impact.severityColor];

  return (
    <div className={`${colors.bg} ${colors.border} border-2 rounded-2xl shadow-custom-shadow overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`${colors.headerBg} text-white px-6 py-4`}>
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">
            {impact.icon} Health Impact Analysis
          </h2>
          <span className={`bg-white bg-opacity-30 px-4 py-1 rounded-full text-sm font-semibold`}>
            {impact.riskLevel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Headline */}
        <h3 className={`${colors.text} font-bold text-2xl mb-4`}>
          {narrative.headline}
        </h3>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Cigarettes Metric */}
          <div className={`${colors.bg} border ${colors.border} rounded-xl p-6 text-center`}>
            <div className="text-6xl mb-2">🚬</div>
            <div className={`${colors.text} text-4xl font-bold mb-2`}>
              {impact.cigarettesSmoked}
            </div>
            <div className={`${colors.text} text-sm font-medium uppercase tracking-wide`}>
              Cigarettes Equivalent
            </div>
          </div>

          {/* Time Lost Metric */}
          <div className={`${colors.bg} border ${colors.border} rounded-xl p-6 text-center`}>
            <div className="text-6xl mb-2">⏱️</div>
            <div className={`${colors.text} text-4xl font-bold mb-2`}>
              {impact.lifeLostHours > 0 
                ? `${impact.lifeLostHours}h ${impact.lifeLostRemainingMinutes}m`
                : `${impact.lifeLostRemainingMinutes}m`
              }
            </div>
            <div className={`${colors.text} text-sm font-medium uppercase tracking-wide`}>
              Life Expectancy Lost
            </div>
          </div>
        </div>

        {/* Narrative Subtext */}
        <div className={`${colors.bg} border-l-4 ${colors.border} p-4 mb-4`}>
          <p className={`${colors.text} text-sm leading-relaxed`}>
            {narrative.subtext}
          </p>
        </div>

        {/* Health Advice */}
        <div className={`bg-white border ${colors.border} rounded-lg p-4 mb-4`}>
          <p className={`${colors.text} text-sm`}>
            <span className="font-bold">💡 Recommendation:</span> {narrative.advice}
          </p>
        </div>

        {/* Scientific Reference */}
        <div className={`${colors.text} text-xs opacity-70 border-t ${colors.border} pt-4 mt-4`}>
          <p className="mb-1">
            <span className="font-semibold">📊 Scientific Basis:</span> Berkeley Earth Study
          </p>
          <p className="leading-relaxed">
            • 22 µg/m³ PM2.5 for 24 hours = 1 cigarette smoked<br/>
            • 1 cigarette = 11 minutes of life expectancy lost (Shaw et al.)<br/>
            • Current PM2.5: {impact.pm25Input} µg/m³ over {exposureHours} hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthImpact;
