/**
 * Health Impact Calculator
 * Converts PM2.5 pollution levels to health metrics using Berkeley Earth formula
 * 
 * Scientific Reference: 
 * - Berkeley Earth Study: 22 µg/m³ PM2.5 for 24 hours = 1 cigarette
 * - Shaw et al. Study: 1 cigarette = 11 minutes of life expectancy lost
 */

/**
 * Calculates health impact metrics from PM2.5 concentration
 * 
 * @param {number} pm25 - Raw PM2.5 concentration in µg/m³
 * @param {number} exposureHours - Hours of exposure (default: 24)
 * @param {number} activityMultiplier - Activity factor (1x rest, 4x exercise)
 * @returns {Object} Health impact data including cigarettes and life lost
 */
export const calculateHealthImpact = (pm25, exposureHours = 24, activityMultiplier = 1) => {
  // Validate input
  if (!pm25 || pm25 < 0 || isNaN(pm25)) {
    return { error: "Invalid PM2.5 value" };
  }

  // Berkeley Earth formula: 22 µg/m³ for 24h = 1 cigarette
  const dailyCigarettes = pm25 / 22;
  
  // Adjust for actual exposure time and activity level
  const actualCigarettes = (dailyCigarettes * (exposureHours / 24)) * activityMultiplier;
  
  // Shaw et al.: 1 cigarette = 11 minutes of life lost
  const lifeLostMinutes = Math.round(actualCigarettes * 11);

  // Determine risk level based on cigarette equivalent
  let riskLevel, severityColor, icon;
  
  if (actualCigarettes < 1) {
    riskLevel = "Safe";
    severityColor = "green";
    icon = "✓";
  } else if (actualCigarettes < 3) {
    riskLevel = "Moderate";
    severityColor = "yellow";
    icon = "⚠️";
  } else if (actualCigarettes < 10) {
    riskLevel = "High";
    severityColor = "orange";
    icon = "⚠️";
  } else {
    riskLevel = "Critical";
    severityColor = "red";
    icon = "🚨";
  }

  return {
    cigarettesSmoked: parseFloat(actualCigarettes.toFixed(1)),
    lifeLostMinutes,
    lifeLostHours: Math.floor(lifeLostMinutes / 60),
    lifeLostRemainingMinutes: lifeLostMinutes % 60,
    riskLevel,
    severityColor,
    icon,
    pm25Input: pm25,
    exposureHours,
    activityMultiplier
  };
};

/**
 * Generates compelling narrative text based on health impact
 * 
 * @param {Object} impact - Health impact object from calculateHealthImpact
 * @returns {Object} Narrative with headline, subtext, and advice
 */
export const getHealthNarrative = (impact) => {
  if (impact.error) {
    return {
      headline: "Data Unavailable",
      subtext: "Unable to calculate health impact.",
      advice: "Please check PM2.5 data."
    };
  }

  const { cigarettesSmoked, lifeLostMinutes, lifeLostHours, lifeLostRemainingMinutes, riskLevel } = impact;
  
  const cigs = Math.round(cigarettesSmoked);
  const hours = lifeLostHours;
  const mins = lifeLostRemainingMinutes;

  const narratives = {
    Safe: {
      headline: "Air Quality Acceptable",
      subtext: `Minimal health impact. Equivalent to ${cigarettesSmoked} cigarette(s) per day.`,
      advice: "Safe for all outdoor activities including exercise."
    },
    Moderate: {
      headline: `Breathing ${cigarettesSmoked} Cigarettes Worth of Pollution`,
      subtext: `You're losing approximately ${lifeLostMinutes} minutes of life expectancy today.`,
      advice: "Sensitive groups (children, elderly, respiratory conditions) should limit prolonged outdoor exposure."
    },
    High: {
      headline: `You Inhaled ${cigs} Cigarettes Today`,
      subtext: `Breathing this air has cost you ${hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`} of life expectancy.`,
      advice: "Avoid prolonged outdoor exercise. Consider using air purifiers indoors. Wear N95 masks if going outside."
    },
    Critical: {
      headline: `HAZARD: ${cigs} Cigarettes Inhaled`,
      subtext: `Medical emergency level pollution. You've lost ${hours > 0 ? `${hours} hours ${mins} minutes` : `${mins} minutes`} of life today.`,
      advice: "Stay indoors immediately. Seal windows. Use air purifiers. Wear N95/N99 masks if you must go out. Avoid all physical exertion."
    }
  };

  return narratives[riskLevel];
};

/**
 * Get activity multiplier for different activity levels
 * 
 * @param {string} activityType - Activity type (resting, walking, jogging)
 * @returns {number} Multiplier factor
 */
export const getActivityMultiplier = (activityType) => {
  const multipliers = {
    resting: 1,
    walking: 1,
    jogging: 4,
    cycling: 4,
    running: 4
  };
  
  return multipliers[activityType] || 1;
};
