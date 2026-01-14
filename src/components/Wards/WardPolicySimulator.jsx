/**
 * WARD POLICY SIMULATOR
 * "What-if" analysis for Delhi ward councilors
 * 
 * Features:
 * - Select ward and see real-time pollution
 * - Choose policies with interactive sliders
 * - See predicted impact with cost-benefit analysis
 * - AI-powered policy recommendations
 * - Evidence-based confidence scores
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import ProfessionalNavbar from '../navbar/ProfessionalNavbar';

const API_BASE = 'http://127.0.0.1:8000/api';

// Policy icons and colors
const POLICY_CONFIG = {
  construction_ban: { icon: '🏗️', color: '#ef4444', name: 'Construction Ban' },
  odd_even: { icon: '🚗', color: '#f97316', name: 'Odd-Even' },
  industrial_shutdown: { icon: '🏭', color: '#8b5cf6', name: 'Industrial Reduction' },
  dust_control: { icon: '🚿', color: '#06b6d4', name: 'Dust Control' },
  traffic_rerouting: { icon: '🚛', color: '#eab308', name: 'Traffic Diversion' },
  smog_tower: { icon: '💨', color: '#10b981', name: 'Smog Tower' },
  green_barrier: { icon: '🌳', color: '#22c55e', name: 'Green Barrier' },
  public_transport_boost: { icon: '🚌', color: '#3b82f6', name: 'Public Transport' }
};

// Severity colors
const getSeverityColor = (severity) => {
  const colors = {
    'EMERGENCY': '#7f1d1d',
    'SEVERE': '#dc2626',
    'VERY_POOR': '#f97316',
    'POOR': '#eab308',
    'MODERATE': '#22c55e'
  };
  return colors[severity] || '#6b7280';
};

// Policy Selection Card - Enhanced Design
const PolicyCard = ({ policy, isSelected, onToggle, params, onParamsChange }) => {
  const config = POLICY_CONFIG[policy.id] || { icon: '📋', color: '#6b7280', name: policy.name };
  
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer backdrop-blur-sm ${
        isSelected 
          ? 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-500/20' 
          : 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={() => onToggle(policy.id)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {config.icon}
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{config.name}</h4>
            <p className="text-xs text-gray-500">{policy.description}</p>
          </div>
        </div>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
          isSelected ? 'bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-gray-200'
        }`}>
          {isSelected && <span className="text-white text-sm font-bold">✓</span>}
        </div>
      </div>
      
      <AnimatePresence>
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-200"
        >
          {policy.id === 'construction_ban' && (
            <div>
              <label className="text-sm font-medium text-gray-600">Duration (days)</label>
              <input 
                type="range" 
                min="1" 
                max="7" 
                value={params.days || 3}
                onChange={(e) => onParamsChange(policy.id, { days: parseInt(e.target.value) })}
                className="w-full mt-2 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="text-center text-blue-600 font-bold text-lg mt-1">{params.days || 3} days</div>
            </div>
          )}
          
          {policy.id === 'industrial_shutdown' && (
            <div>
              <label className="text-sm font-medium text-gray-600">Capacity Reduction (%)</label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="10"
                value={params.capacity_reduction_pct || 30}
                onChange={(e) => onParamsChange(policy.id, { capacity_reduction_pct: parseInt(e.target.value) })}
                className="w-full mt-2 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-500"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="text-center text-purple-600 font-bold text-lg mt-1">{params.capacity_reduction_pct || 30}%</div>
            </div>
          )}
          
          {policy.id === 'dust_control' && (
            <div>
              <label className="text-sm font-medium text-gray-600">Road Coverage (km)</label>
              <input 
                type="range" 
                min="5" 
                max="50" 
                step="5"
                value={params.road_km || 15}
                onChange={(e) => onParamsChange(policy.id, { road_km: parseInt(e.target.value) })}
                className="w-full mt-2 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-cyan-500"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="text-center text-cyan-600 font-bold text-lg mt-1">{params.road_km || 15} km</div>
            </div>
          )}
          
          {policy.id === 'smog_tower' && (
            <div>
              <label className="text-sm font-medium text-gray-600">Number of Units</label>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={params.units || 2}
                onChange={(e) => onParamsChange(policy.id, { units: parseInt(e.target.value) })}
                className="w-full mt-2 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="text-center text-emerald-600 font-bold text-lg mt-1">{params.units || 2} units</div>
            </div>
          )}
          
          {['odd_even', 'traffic_rerouting', 'green_barrier', 'public_transport_boost'].includes(policy.id) && (
            <div className="text-center text-emerald-600 font-medium bg-emerald-50 rounded-xl py-2">
              ✓ Policy enabled
            </div>
          )}
          
          <div className="flex justify-between mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            <span>Confidence: <strong className="text-gray-700">{policy.confidence}</strong></span>
            <span>{policy.implementation_time}</span>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
};

// Results Panel - Enhanced Design
const SimulationResults = ({ results, isMultiple }) => {
  if (!results) return null;
  
  const impact = isMultiple ? results.combined_impact : results.predicted_impact;
  const cost = isMultiple ? results.cost_summary : results.cost_analysis;
  const health = isMultiple ? results.health_benefits : results.health_benefits;
  
  return (
    <div className="space-y-5">
      {/* Impact Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 shadow-lg"
      >
        <h3 className="text-xl font-bold text-emerald-700 mb-5 flex items-center gap-2">
          <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">📊</span>
          Predicted Impact
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-white/70 rounded-xl p-4 border border-red-200">
            <div className="text-3xl font-bold text-red-500">{impact.pm25_before || impact.current_pm25}</div>
            <div className="text-sm text-gray-500 font-medium">Before (µg/m³)</div>
          </div>
          <div className="text-center bg-white/70 rounded-xl p-4 border border-emerald-200">
            <div className="text-3xl font-bold text-emerald-500">{impact.pm25_after || impact.predicted_pm25}</div>
            <div className="text-sm text-gray-500 font-medium">After (µg/m³)</div>
          </div>
          <div className="text-center bg-white/70 rounded-xl p-4 border border-blue-200">
            <div className="text-3xl font-bold text-blue-500">
              -{impact.reduction_percent || impact.total_reduction_percent}%
            </div>
            <div className="text-sm text-gray-500 font-medium">Reduction</div>
          </div>
          <div className="text-center bg-white/70 rounded-xl p-4 border border-amber-200">
            <div className="text-3xl font-bold text-amber-500">
              {impact.timeline || '48-72h'}
            </div>
            <div className="text-sm text-gray-500 font-medium">Timeline</div>
          </div>
        </div>
        
        {isMultiple && results.individual_results && (
          <div className="mt-5 pt-5 border-t border-emerald-200">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Individual Policy Contributions:</h4>
            <div className="flex flex-wrap gap-2">
              {results.individual_results.map((policy, idx) => (
                <span key={idx} className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 border border-gray-200 shadow-sm">
                  {policy.policy}: <span className="text-emerald-600 font-bold">-{policy.reduction_percent}%</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Cost Analysis */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg"
      >
        <h3 className="text-xl font-bold text-amber-600 mb-5 flex items-center gap-2">
          <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">💰</span>
          Cost Analysis
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="text-2xl font-bold text-gray-800">
              ₹{cost.total_cost_crore} Cr
            </div>
            <div className="text-sm text-gray-500 font-medium">Total Cost</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl font-bold text-gray-800">
              ₹{cost.cost_per_ug_reduced || cost.cost_per_percent_reduction} L
            </div>
            <div className="text-sm text-gray-500 font-medium">Per {cost.cost_per_ug_reduced ? 'µg/m³' : '% reduction'}</div>
          </div>
          {health && (
            <div className={`rounded-xl p-4 border ${health.roi_percent > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-2xl font-bold ${health.roi_percent > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {health.roi_percent > 0 ? '+' : ''}{health.roi_percent}%
              </div>
              <div className="text-sm text-gray-500 font-medium">ROI</div>
            </div>
          )}
        </div>
        
        {cost.affected && (
          <div className="mt-5 pt-5 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">Affected Sectors:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {cost.affected.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
      
      {/* Health Benefits */}
      {health && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200 shadow-lg"
        >
          <h3 className="text-xl font-bold text-red-600 mb-5 flex items-center gap-2">
            <span className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">🏥</span>
            Health Benefits
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-white/70 rounded-xl p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">
                {health.respiratory_cases_avoided?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 font-medium">Respiratory Cases Avoided</div>
            </div>
            <div className="text-center bg-white/70 rounded-xl p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">
                {health.statistical_lives_saved}
              </div>
              <div className="text-xs text-gray-500 font-medium">Statistical Lives Saved</div>
            </div>
            <div className="text-center bg-white/70 rounded-xl p-4 border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600">
                ₹{health.healthcare_savings_lakhs} L
              </div>
              <div className="text-xs text-gray-500 font-medium">Healthcare Savings</div>
            </div>
            <div className={`text-center rounded-xl p-4 border ${
              health.verdict === 'COST_EFFECTIVE' ? 'bg-emerald-100 border-emerald-300' : 'bg-amber-100 border-amber-300'
            }`}>
              <div className={`text-xl font-bold ${
                health.verdict === 'COST_EFFECTIVE' ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {health.verdict?.replace('_', ' ')}
              </div>
              <div className="text-xs text-gray-500 font-medium">Verdict</div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Recommendation */}
      {results.recommendation && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-5 rounded-2xl border-2 ${
            results.recommendation.verdict?.includes('RECOMMEND') 
              ? 'bg-emerald-50 border-emerald-300' 
              : 'bg-amber-50 border-amber-300'
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{results.recommendation.emoji}</span>
            <div>
              <div className={`font-bold text-lg ${
                results.recommendation.verdict?.includes('RECOMMEND') ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {results.recommendation.verdict?.replace(/_/g, ' ')}
              </div>
              <div className="text-sm text-gray-600">{results.recommendation.reason}</div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Evidence */}
      {results.evidence && (
        <div className="text-sm text-gray-500 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
          <span>📚</span>
          <span>{results.evidence.source} (Confidence: <strong>{results.evidence.confidence}</strong>)</span>
        </div>
      )}
    </div>
  );
};

// AI Recommendation Panel
const AIRecommendation = ({ data }) => {
  if (!data) return null;
  
  const { current_situation, ai_recommendation } = data;
  
  return (
    <div className="space-y-4">
      {/* Current Situation */}
      <div 
        className="p-4 rounded-card border"
        style={{ backgroundColor: `${getSeverityColor(current_situation.severity)}15`, borderColor: `${getSeverityColor(current_situation.severity)}40` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-ink text-lg">Current Situation</h3>
            <p className="text-metal">PM2.5: {current_situation.pm25} µg/m³</p>
          </div>
          <div 
            className="px-4 py-2 rounded-full font-bold text-white"
            style={{ backgroundColor: getSeverityColor(current_situation.severity) }}
          >
            {current_situation.severity}
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-2">
          {current_situation.top_pollution_sources?.map((src, idx) => (
            <span key={idx} className="px-3 py-1 bg-canvas border border-mist rounded-full text-sm text-ink">
              {src.source}: {src.contribution}
            </span>
          ))}
        </div>
      </div>
      
      {/* AI Reasoning */}
      <div className="bg-purple-50 rounded-card p-4 border border-purple-200">
        <h3 className="font-bold text-purple-700 mb-3">🤖 AI Analysis</h3>
        <ul className="space-y-2">
          {ai_recommendation.reasoning?.map((reason, idx) => (
            <li key={idx} className="text-ink text-sm flex items-start gap-2">
              <span className="text-purple-500 mt-0.5">•</span>
              {reason}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Recommended Policies */}
      <div className="bg-canvas rounded-card p-4 border border-mist">
        <h3 className="font-bold text-primary mb-3">📋 Recommended Policies</h3>
        <div className="space-y-2">
          {ai_recommendation.recommended_policies?.map((policy, idx) => {
            const config = POLICY_CONFIG[policy.type] || { icon: '📋', name: policy.type };
            return (
              <div key={idx} className="flex items-center justify-between p-3 bg-surface rounded-card border border-mist">
                <div className="flex items-center gap-2">
                  <span>{config.icon}</span>
                  <span className="text-ink font-medium">{config.name}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${
                  policy.priority === 'CRITICAL' ? 'bg-red-500' :
                  policy.priority === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'
                }`}>
                  {policy.priority}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Expected Outcome */}
      {ai_recommendation.expected_outcome && (
        <SimulationResults results={{ combined_impact: ai_recommendation.expected_outcome, cost_summary: ai_recommendation.total_cost, health_benefits: ai_recommendation.health_benefits }} isMultiple={true} />
      )}
    </div>
  );
};

// Main Component
const WardPolicySimulator = () => {
  const [wards, setWards] = useState([]);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [wardData, setWardData] = useState(null);
  const [availablePolicies, setAvailablePolicies] = useState([]);
  const [selectedPolicies, setSelectedPolicies] = useState({});
  const [policyParams, setPolicyParams] = useState({});
  const [simulationResults, setSimulationResults] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'
  const navigate = useNavigate();
  
  // Fetch wards list
  useEffect(() => {
    const fetchWards = async () => {
      try {
        const response = await axios.get(`${API_BASE}/delhi/wards/pollution/`);
        setWards(response.data.wards || []);
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    };
    fetchWards();
  }, []);
  
  // Fetch available policies
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get(`${API_BASE}/policy/available/`);
        const policies = Object.entries(response.data.policies || {}).map(([id, data]) => ({
          id,
          ...data
        }));
        setAvailablePolicies(policies);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };
    fetchPolicies();
  }, []);
  
  // Fetch ward data when selected
  useEffect(() => {
    const fetchWardData = async () => {
      if (!selectedWardId) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE}/policy/ward-realtime/?ward_id=${selectedWardId}`);
        setWardData(response.data);
        setSimulationResults(null);
        setAiRecommendation(null);
      } catch (error) {
        console.error('Error fetching ward data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWardData();
  }, [selectedWardId]);
  
  // Toggle policy selection
  const togglePolicy = (policyId) => {
    setSelectedPolicies(prev => ({
      ...prev,
      [policyId]: !prev[policyId]
    }));
    
    // Set default params
    if (!policyParams[policyId]) {
      const defaults = {
        construction_ban: { days: 3 },
        odd_even: { enabled: true },
        industrial_shutdown: { capacity_reduction_pct: 30 },
        dust_control: { road_km: 15 },
        traffic_rerouting: { enabled: true },
        smog_tower: { units: 2 },
        green_barrier: {},
        public_transport_boost: {}
      };
      setPolicyParams(prev => ({
        ...prev,
        [policyId]: defaults[policyId] || {}
      }));
    }
  };
  
  // Update policy params
  const updateParams = (policyId, params) => {
    setPolicyParams(prev => ({
      ...prev,
      [policyId]: { ...prev[policyId], ...params }
    }));
  };
  
  // Run simulation
  const runSimulation = async () => {
    if (!wardData) return;
    
    const activePolicies = Object.entries(selectedPolicies)
      .filter(([_, isSelected]) => isSelected)
      .map(([policyId]) => ({
        type: policyId,
        params: policyParams[policyId] || {}
      }));
    
    if (activePolicies.length === 0) {
      alert('Please select at least one policy');
      return;
    }
    
    setLoading(true);
    try {
      if (activePolicies.length === 1) {
        // Single policy
        const response = await axios.post(`${API_BASE}/policy/simulate/`, {
          ward_id: selectedWardId,
          current_pm25: wardData.current_pollution.pm25,
          policy_type: activePolicies[0].type,
          policy_params: activePolicies[0].params
        });
        setSimulationResults({ ...response.data, isMultiple: false });
      } else {
        // Multiple policies
        const response = await axios.post(`${API_BASE}/policy/simulate-multiple/`, {
          ward_id: selectedWardId,
          current_pm25: wardData.current_pollution.pm25,
          policies: activePolicies
        });
        setSimulationResults({ ...response.data, isMultiple: true });
      }
    } catch (error) {
      console.error('Error running simulation:', error);
      alert('Error running simulation');
    } finally {
      setLoading(false);
    }
  };
  
  // Get AI recommendation
  const getAIRecommendation = async () => {
    if (!wardData) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE}/policy/ai-recommend/?ward_id=${selectedWardId}&pm25=${wardData.current_pollution.pm25}`
      );
      setAiRecommendation(response.data);
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      alert('Error getting AI recommendation');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-canvas page-gradient">
      {/* Professional Navbar */}
      <ProfessionalNavbar onSearchSelected={() => {}} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-ink">
          🎛️ Policy Simulator
        </h1>
        <p className="text-metal mt-2">
          "What-if" analysis for Delhi ward councilors • Simulate policy impacts before implementation
        </p>
      </motion.div>
      
      {/* Ward Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <label className="block text-sm font-semibold text-metal mb-2">Select Ward</label>
        <select 
          value={selectedWardId || ''}
          onChange={(e) => setSelectedWardId(parseInt(e.target.value) || null)}
          className="select-input w-full md:w-96"
        >
          <option value="">-- Select a Ward --</option>
          {wards.map(ward => (
            <option key={ward.ward_id} value={ward.ward_id}>
              {ward.ward_name} ({ward.zone}) - AQI: {ward.avg_aqi} [{ward.urgency}]
            </option>
          ))}
        </select>
      </motion.div>
      
      {/* Ward Current Status */}
      {wardData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 bento-card p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ink">{wardData.ward_name}</h2>
              <p className="text-metal">{wardData.zone} Zone • {wardData.ward_type}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center bg-status-danger/10 rounded-card px-4 py-3 border border-status-danger/20">
                <div className="text-4xl font-bold text-status-danger">{wardData.current_pollution.pm25}</div>
                <div className="text-sm text-metal font-medium">PM2.5 µg/m³</div>
              </div>
              <div className="text-center bg-status-warning/10 rounded-card px-4 py-3 border border-status-warning/20">
                <div className="text-4xl font-bold text-status-warning">{wardData.current_pollution.aqi}</div>
                <div className="text-sm text-metal font-medium">AQI</div>
              </div>
              <div 
                className="px-5 py-3 rounded-card font-bold text-white shadow-card"
                style={{ backgroundColor: getSeverityColor(wardData.current_pollution.urgency?.replace('CRITICAL', 'EMERGENCY')) }}
              >
                {wardData.current_pollution.urgency}
              </div>
            </div>
          </div>
          
          {/* Top Sources */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-metal mr-2 font-medium">Top Sources:</span>
            {wardData.pollution_analysis?.top_sources?.slice(0, 3).map((src, idx) => (
              <span key={idx} className="px-4 py-1.5 bg-canvas rounded-card text-sm font-medium text-ink border border-mist">
                {src.source}: {src.percentage}%
              </span>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Tabs */}
      {wardData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex gap-2 bg-surface p-2 rounded-card border border-mist w-fit shadow-card"
        >
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-6 py-3 rounded-button font-semibold transition-all ${
              activeTab === 'manual' 
                ? 'bg-primary text-white shadow-card' 
                : 'text-metal hover:bg-canvas'
            }`}
          >
            🎛️ Manual Selection
          </button>
          <button
            onClick={() => { setActiveTab('ai'); getAIRecommendation(); }}
            className={`px-6 py-3 rounded-button font-semibold transition-all ${
              activeTab === 'ai' 
                ? 'bg-primary text-white shadow-card' 
                : 'text-metal hover:bg-canvas'
            }`}
          >
            🤖 AI Recommendation
          </button>
        </motion.div>
      )}
      
      {/* Main Content */}
      {wardData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Policy Selection / AI */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {activeTab === 'manual' ? (
              <>
                <h3 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm">📋</span>
                  Select Policies to Simulate
                </h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {availablePolicies.map(policy => (
                    <PolicyCard
                      key={policy.id}
                      policy={policy}
                      isSelected={selectedPolicies[policy.id]}
                      onToggle={togglePolicy}
                      params={policyParams[policy.id] || {}}
                      onParamsChange={updateParams}
                    />
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={runSimulation}
                  disabled={loading || Object.values(selectedPolicies).filter(Boolean).length === 0}
                  className="mt-6 w-full py-4 bg-primary hover:bg-primary-700 text-white font-bold rounded-card shadow-card transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Simulating...' : '🚀 Run Simulation'}
                </motion.button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm">🤖</span>
                  AI-Powered Recommendation
                </h3>
                {loading ? (
                  <div className="text-center py-16 bento-card">
                    <div className="relative mx-auto mb-6 w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-metal font-medium">Analyzing ward conditions...</p>
                  </div>
                ) : aiRecommendation ? (
                  <AIRecommendation data={aiRecommendation} />
                ) : (
                  <div className="text-center py-16 text-metal bento-card">
                    Click the tab to get AI recommendation
                  </div>
                )}
              </>
            )}
          </motion.div>
          
          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-sm">📊</span>
              Simulation Results
            </h3>
            {simulationResults ? (
              <SimulationResults 
                results={simulationResults} 
                isMultiple={simulationResults.isMultiple} 
              />
            ) : (
              <div className="text-center py-16 text-metal bento-card">
                <div className="w-20 h-20 mx-auto mb-4 bg-canvas rounded-card flex items-center justify-center">
                  <span className="text-4xl">📊</span>
                </div>
                <p className="font-medium">Select policies and run simulation to see predicted impact</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
      
      {/* Empty State */}
      {!selectedWardId && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bento-card"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-card flex items-center justify-center">
            <span className="text-5xl">🏛️</span>
          </div>
          <h2 className="text-2xl font-bold text-ink mb-2">Select a Ward to Begin</h2>
          <p className="text-metal">
            Choose a Delhi ward from the dropdown above to analyze its pollution and simulate policy impacts
          </p>
        </motion.div>
      )}
      
      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12"
      >
        <div className="bento-card p-6 text-center">
          <p className="text-metal text-sm">Evidence Sources: CPCB Studies, TERI Research, IIT Delhi Studies, Delhi Traffic Police Reports</p>
          <p className="text-metal/60 text-xs mt-2">
            Disclaimer: Predictions based on historical data and research. Actual results may vary.
          </p>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default WardPolicySimulator;
