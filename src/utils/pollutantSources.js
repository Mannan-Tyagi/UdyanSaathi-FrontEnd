/**
 * Pollutant Sources and Causes Data
 * Provides explanations for why specific pollutants are elevated
 * Based on CPCB, WHO, and EPA guidelines
 */

// Detailed pollutant information with sources and health effects
export const POLLUTANT_INFO = {
  OZONE: {
    name: 'Ground-Level Ozone',
    formula: 'O₃',
    icon: '🌫️',
    limit: 168, // µg/m³ (8-hour average WHO guideline)
    sources: [
      { name: 'Vehicle Emissions', percentage: 35, icon: '🚗', description: 'NOx and VOCs from vehicles react in sunlight' },
      { name: 'Industrial Emissions', percentage: 25, icon: '🏭', description: 'Factories release precursor chemicals' },
      { name: 'Sunlight & Heat', percentage: 20, icon: '☀️', description: 'High temperatures accelerate ozone formation' },
      { name: 'Power Plants', percentage: 15, icon: '⚡', description: 'Coal-fired plants emit NOx' },
      { name: 'Consumer Products', percentage: 5, icon: '🧴', description: 'Paints, solvents, aerosols release VOCs' }
    ],
    healthEffects: [
      'Triggers asthma and respiratory issues',
      'Reduces lung function',
      'Causes chest pain and coughing',
      'Increases susceptibility to infections'
    ],
    peakHours: '2 PM - 6 PM (peak sunlight hours)',
    recommendations: [
      'Avoid outdoor exercise during afternoon',
      'Use air purifiers indoors',
      'Keep windows closed during peak hours'
    ]
  },
  CO: {
    name: 'Carbon Monoxide',
    formula: 'CO',
    icon: '⚫',
    limit: 10, // mg/m³ (8-hour average)
    sources: [
      { name: 'Vehicle Exhaust', percentage: 60, icon: '🚗', description: 'Incomplete combustion in engines' },
      { name: 'Industrial Processes', percentage: 15, icon: '🏭', description: 'Metal processing, chemical manufacturing' },
      { name: 'Biomass Burning', percentage: 12, icon: '🔥', description: 'Crop residue and wood burning' },
      { name: 'Construction Equipment', percentage: 8, icon: '🏗️', description: 'Diesel generators and machinery' },
      { name: 'Residential Heating', percentage: 5, icon: '🏠', description: 'Coal and wood stoves' }
    ],
    healthEffects: [
      'Reduces oxygen delivery to organs',
      'Causes headaches and dizziness',
      'Impairs concentration and alertness',
      'Dangerous for heart patients'
    ],
    peakHours: '7 AM - 10 AM & 6 PM - 9 PM (traffic peaks)',
    recommendations: [
      'Avoid heavy traffic areas',
      'Ensure proper ventilation indoors',
      'Check CO detectors at home'
    ]
  },
  PM10: {
    name: 'Particulate Matter (Coarse)',
    formula: 'PM10',
    icon: '💨',
    limit: 250, // µg/m³ (24-hour average NAAQS severe)
    sources: [
      { name: 'Construction Dust', percentage: 30, icon: '🏗️', description: 'Building sites and demolition' },
      { name: 'Road Dust', percentage: 25, icon: '🛣️', description: 'Unpaved roads and vehicle movement' },
      { name: 'Industrial Emissions', percentage: 20, icon: '🏭', description: 'Cement, mining, manufacturing' },
      { name: 'Vehicle Emissions', percentage: 15, icon: '🚗', description: 'Tire and brake wear, exhaust' },
      { name: 'Agricultural Activities', percentage: 10, icon: '🌾', description: 'Crop harvesting and stubble burning' }
    ],
    healthEffects: [
      'Irritates nose and throat',
      'Aggravates asthma symptoms',
      'Causes respiratory infections',
      'Reduces visibility'
    ],
    peakHours: 'Morning (6-9 AM) and Evening (6-10 PM)',
    recommendations: [
      'Wear N95/N99 mask outdoors',
      'Use air purifiers with HEPA filters',
      'Wet mop floors to reduce dust'
    ]
  },
  PM25: {
    name: 'Fine Particulate Matter',
    formula: 'PM2.5',
    icon: '🌫️',
    limit: 90, // µg/m³ (24-hour average NAAQS poor)
    sources: [
      { name: 'Vehicle Emissions', percentage: 35, icon: '🚗', description: 'Diesel exhaust, especially trucks' },
      { name: 'Biomass Burning', percentage: 25, icon: '🔥', description: 'Crop burning, wood fires, garbage burning' },
      { name: 'Industrial Emissions', percentage: 20, icon: '🏭', description: 'Power plants, factories, refineries' },
      { name: 'Construction', percentage: 12, icon: '🏗️', description: 'Cement dust, demolition particles' },
      { name: 'Secondary Formation', percentage: 8, icon: '🧪', description: 'Chemical reactions in atmosphere' }
    ],
    healthEffects: [
      'Penetrates deep into lungs',
      'Causes cardiovascular disease',
      'Increases stroke risk',
      'Linked to cognitive decline'
    ],
    peakHours: 'Winter nights (10 PM - 6 AM) due to inversion',
    recommendations: [
      'Stay indoors during high pollution',
      'Avoid outdoor exercise',
      'Use N95 masks when going out',
      'Run air purifiers continuously'
    ]
  },
  NO2: {
    name: 'Nitrogen Dioxide',
    formula: 'NO₂',
    icon: '🟤',
    limit: 180, // µg/m³ (1-hour average WHO guideline)
    sources: [
      { name: 'Vehicle Traffic', percentage: 50, icon: '🚗', description: 'Especially diesel vehicles' },
      { name: 'Power Plants', percentage: 20, icon: '⚡', description: 'Coal and natural gas combustion' },
      { name: 'Industrial Facilities', percentage: 15, icon: '🏭', description: 'Factories and manufacturing' },
      { name: 'Domestic Heating', percentage: 10, icon: '🏠', description: 'Gas stoves and heaters' },
      { name: 'Waste Burning', percentage: 5, icon: '🗑️', description: 'Open garbage burning' }
    ],
    healthEffects: [
      'Inflames airways',
      'Reduces lung function',
      'Triggers asthma attacks',
      'Increases vulnerability to infections'
    ],
    peakHours: '8 AM - 10 AM & 5 PM - 8 PM (rush hours)',
    recommendations: [
      'Avoid busy roads during peak traffic',
      'Keep windows closed near highways',
      'Use indoor air purifiers'
    ]
  },
  SO2: {
    name: 'Sulfur Dioxide',
    formula: 'SO₂',
    icon: '🔶',
    limit: 380, // µg/m³ (24-hour average NAAQS severe)
    sources: [
      { name: 'Power Plants', percentage: 40, icon: '⚡', description: 'Coal-fired thermal power stations' },
      { name: 'Industrial Processes', percentage: 30, icon: '🏭', description: 'Metal smelting, refineries, chemical plants' },
      { name: 'Vehicle Emissions', percentage: 15, icon: '🚗', description: 'Diesel with high sulfur content' },
      { name: 'Domestic Fuel', percentage: 10, icon: '🏠', description: 'Coal and kerosene burning' },
      { name: 'Volcanic Activity', percentage: 5, icon: '🌋', description: 'Natural emissions (rare in urban areas)' }
    ],
    healthEffects: [
      'Causes breathing difficulty',
      'Aggravates heart disease',
      'Irritates eyes and throat',
      'Contributes to acid rain'
    ],
    peakHours: 'Industrial operating hours (8 AM - 6 PM)',
    recommendations: [
      'Monitor air quality near industrial areas',
      'Use masks if living near power plants',
      'Keep windows closed on high SO2 days'
    ]
  }
};

/**
 * Get detailed pollutant information
 * @param {string} pollutantKey - Key like 'OZONE', 'CO', 'PM25', etc.
 * @returns {Object} Pollutant info object
 */
export const getPollutantInfo = (pollutantKey) => {
  return POLLUTANT_INFO[pollutantKey] || null;
};

/**
 * Get the top pollution source for a pollutant
 * @param {string} pollutantKey - Key like 'OZONE', 'CO', etc.
 * @returns {Object} Top source object with name, percentage, description
 */
export const getTopPollutionSource = (pollutantKey) => {
  const info = POLLUTANT_INFO[pollutantKey];
  if (!info) return null;
  return info.sources.reduce((max, source) => 
    source.percentage > max.percentage ? source : max
  , info.sources[0]);
};

/**
 * Get severity level based on pollutant value
 * @param {string} pollutantKey - Key like 'OZONE', 'CO', etc.
 * @param {number} value - Current pollutant value
 * @returns {Object} Severity info with level, color, message
 */
export const getSeverityInfo = (pollutantKey, value) => {
  const info = POLLUTANT_INFO[pollutantKey];
  if (!info) return { level: 'Unknown', color: 'gray' };
  
  const ratio = value / info.limit;
  
  if (ratio <= 0.5) {
    return { level: 'Good', color: 'green', message: 'Air quality is satisfactory' };
  } else if (ratio <= 1) {
    return { level: 'Moderate', color: 'yellow', message: 'Acceptable; may be risk for sensitive people' };
  } else if (ratio <= 1.5) {
    return { level: 'Unhealthy', color: 'orange', message: 'General public may experience effects' };
  } else if (ratio <= 2) {
    return { level: 'Very Unhealthy', color: 'red', message: 'Health alert - everyone may experience effects' };
  } else {
    return { level: 'Hazardous', color: 'maroon', message: 'Emergency conditions - serious health effects' };
  }
};

export default POLLUTANT_INFO;
