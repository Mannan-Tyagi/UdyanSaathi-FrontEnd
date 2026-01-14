/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPollutantInfo, getSeverityInfo } from '../../utils/pollutantSources';

/**
 * PollutantAlertModal - Shows detailed reasons why a pollutant is high
 * Includes sources breakdown, health effects, and recommendations
 */
const PollutantAlertModal = ({ 
  isOpen, 
  onClose, 
  pollutant, // { chemical: 'OZONE', amount: 180, level: 'Danger', message: '...' }
  historicalData = [] // For mini graph visualization
}) => {
  const [activeTab, setActiveTab] = useState('sources');
  
  if (!isOpen || !pollutant) return null;
  
  const pollutantInfo = getPollutantInfo(pollutant.chemical);
  const severity = pollutantInfo ? getSeverityInfo(pollutant.chemical, pollutant.amount) : null;
  
  if (!pollutantInfo) {
    return null;
  }

  // Color schemes based on severity
  const severityColors = {
    green: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    yellow: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    orange: { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    red: { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    maroon: { bg: 'bg-red-800', light: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    gray: { bg: 'bg-gray-500', light: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
  };
  
  const colors = severityColors[severity?.color || 'red'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-[600px] max-h-[90vh] 
                         bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
            {/* Header */}
            <div className={`${colors.bg} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{pollutantInfo.icon}</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">{pollutantInfo.name}</h2>
                    <p className="text-white/80 text-sm">{pollutantInfo.formula} • {severity?.level} Level</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Value Display */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Current Level</p>
                  <p className={`text-3xl font-black ${colors.text}`}>{pollutant.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Safe Limit</p>
                  <p className="text-xl font-bold text-gray-700">{pollutantInfo.limit}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl ${colors.light} ${colors.border} border`}>
                  <p className={`text-sm font-medium ${colors.text}`}>
                    {((pollutant.amount / pollutantInfo.limit) * 100).toFixed(0)}% of limit
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {[
                { id: 'sources', label: 'Why High?', icon: '📊' },
                { id: 'health', label: 'Health Effects', icon: '❤️' },
                { id: 'actions', label: 'What To Do', icon: '✅' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-sm font-medium transition-colors relative
                    ${activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>{tab.icon}</span>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'sources' && (
                  <motion.div
                    key="sources"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-1">Main Pollution Sources</h3>
                      <p className="text-sm text-gray-500">Contributing factors to elevated {pollutantInfo.formula} levels</p>
                    </div>
                    
                    {pollutantInfo.sources.map((source, index) => (
                      <motion.div
                        key={source.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl">{source.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">{source.name}</span>
                              <span className={`text-sm font-bold ${colors.text}`}>{source.percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${source.percentage}%` }}
                                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                                className={`h-full ${colors.bg} rounded-full`}
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 ml-8 mb-3">{source.description}</p>
                      </motion.div>
                    ))}

                    {/* Peak Hours Info */}
                    <div className={`mt-4 p-4 rounded-xl ${colors.light} ${colors.border} border`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span>⏰</span>
                        <span className="font-medium text-gray-900">Peak Pollution Hours</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{pollutantInfo.peakHours}</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'health' && (
                  <motion.div
                    key="health"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-1">Health Impact</h3>
                      <p className="text-sm text-gray-500">How elevated {pollutantInfo.formula} affects your health</p>
                    </div>

                    <div className={`p-4 rounded-xl ${colors.light} ${colors.border} border mb-4`}>
                      <p className={`text-sm font-medium ${colors.text}`}>
                        ⚠️ {severity?.message}
                      </p>
                    </div>

                    {pollutantInfo.healthEffects.map((effect, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <div className={`w-6 h-6 ${colors.light} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <span className={`text-xs ${colors.text}`}>•</span>
                        </div>
                        <p className="text-sm text-gray-700">{effect}</p>
                      </motion.div>
                    ))}

                    {/* Vulnerable Groups */}
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <span>👥</span>
                        <span className="font-medium text-red-800">Vulnerable Groups</span>
                      </div>
                      <p className="text-sm text-red-700 ml-6">
                        Children, elderly, pregnant women, and people with respiratory or heart conditions are at higher risk.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'actions' && (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-1">Recommended Actions</h3>
                      <p className="text-sm text-gray-500">Steps to protect yourself from {pollutantInfo.formula}</p>
                    </div>

                    {pollutantInfo.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl"
                      >
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700 pt-1.5">{rec}</p>
                      </motion.div>
                    ))}

                    {/* Quick Actions */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                        <span className="text-2xl">😷</span>
                        <p className="text-xs text-blue-700 mt-1 font-medium">Wear N95 Mask</p>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
                        <span className="text-2xl">🏠</span>
                        <p className="text-xs text-purple-700 mt-1 font-medium">Stay Indoors</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-center">
                        <span className="text-2xl">🌬️</span>
                        <p className="text-xs text-green-700 mt-1 font-medium">Use Air Purifier</p>
                      </div>
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-center">
                        <span className="text-2xl">🚫</span>
                        <p className="text-xs text-orange-700 mt-1 font-medium">Avoid Exercise</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  Data source: CPCB, WHO Guidelines
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PollutantAlertModal;
