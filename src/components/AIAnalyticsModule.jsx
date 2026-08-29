import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { BrainCircuit, Sparkles, TrendingUp, Factory, Warehouse, Truck, ShoppingBag, Zap, Maximize2, X, CheckCircle2, ArrowUpRight, Cpu, Sliders, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

export const AiAnalyticsModule = () => {
  const { isDark } = useTheme();

  // Selected Enlarged Card State
  const [activeModalSection, setActiveModalSection] = useState(null);

  // AI Interactive Simulation Sliders State
  const [simProductionVol, setSimProductionVol] = useState(2500);
  const [simRetailPriceMargin, setSimRetailPriceMargin] = useState(15);

  const estimatedRevenue = Math.round(simProductionVol * 190 * (1 + simRetailPriceMargin / 100));
  const estimatedProfit = Math.round(estimatedRevenue * 0.28);

  const forecastTrendData = [
    { day: 'Mon', actual: 4200, aiPredicted: 4350 },
    { day: 'Tue', actual: 4800, aiPredicted: 4700 },
    { day: 'Wed', actual: 5100, aiPredicted: 5250 },
    { day: 'Thu', actual: 4900, aiPredicted: 5000 },
    { day: 'Fri', actual: 5600, aiPredicted: 5800 },
    { day: 'Sat (Pred)', actual: null, aiPredicted: 6400 },
    { day: 'Sun (Pred)', actual: null, aiPredicted: 6900 }
  ];

  // 4 Main Section AI Data Objects
  const aiSections = [
    {
      id: 'production',
      title: 'Production Flow AI Engine',
      category: 'Extraction & Yield Telemetry',
      icon: Factory,
      color: 'blue',
      badgeColor: 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
      accentBorder: 'border-l-4 border-blue-600',
      shortSummary: 'Temperature tuning & predictive machine vibration alerts for optimal oil extraction.',
      confidence: '99.2%',
      insights: [
        {
          heading: 'Cold-Pressed Extraction Temperature Tuning',
          badge: '+14% Extra Yield',
          desc: 'AI neural models recommend maintaining Cold-Pressed Coconut Oil press temperature at exactly 42°C to maximize oil output by 140 Liters per batch.'
        },
        {
          heading: 'Predictive Vibration Wear Analysis',
          badge: '48 Hrs Maintenance Window',
          desc: 'Vibration telemetry sensors detect micro-wear on Hydraulic Press #2 bearing. Schedule maintenance before Thursday morning shift.'
        }
      ],
      detailedAnalysis: {
        recommendedAction: 'Apply 42°C Temperature Lock to Pressing Unit #1 & #2',
        impactScore: '+140 Liters per batch',
        historicalData: [
          { batch: 'Batch 101', yield: 82 },
          { batch: 'Batch 102', yield: 86 },
          { batch: 'Batch 103 (AI)', yield: 96 },
          { batch: 'Batch 104 (AI)', yield: 98 }
        ]
      }
    },
    {
      id: 'inventory',
      title: 'Inventory Flow AI Engine',
      category: 'Stockout Risk & Capacity Balancing',
      icon: Warehouse,
      color: 'amber',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
      accentBorder: 'border-l-4 border-amber-500',
      shortSummary: 'Automated depletion horizon prediction & tank storage balancing.',
      confidence: '97.8%',
      insights: [
        {
          heading: 'Mustard Oil Depletion Risk Forecast',
          badge: 'Depletion in 3 Days',
          desc: 'Current stock is 450L with daily sales velocity of 150L/day. Automated AI reorder trigger dispatched to Production Staff.'
        },
        {
          heading: 'Optimal Tank Silo Transfer Balancing',
          badge: 'Capacity Optimized',
          desc: 'Groundnut Oil storage at 50% capacity. AI recommends transferring 1,000L to Reserve Silo #3 to free processing tank.'
        }
      ],
      detailedAnalysis: {
        recommendedAction: 'Trigger 800L Mustard Oil Extraction Batch Immediately',
        impactScore: 'Prevents Stockout Penalty',
        historicalData: [
          { batch: 'Groundnut', stock: 5000 },
          { batch: 'Sunflower', stock: 3500 },
          { batch: 'Mustard', stock: 450 },
          { batch: 'Sesame', stock: 1800 },
          { batch: 'Coconut', stock: 4000 }
        ]
      }
    },
    {
      id: 'supplier',
      title: 'Supplier Flow AI Engine',
      category: 'Raw Seed Commodity Prices & Reliability',
      icon: Truck,
      color: 'emerald',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
      accentBorder: 'border-l-4 border-emerald-500',
      shortSummary: 'Raw groundnut market price spike alerts & supplier reliability scores.',
      confidence: '98.5%',
      insights: [
        {
          heading: 'Raw Seed Commodity Price Spike Alert',
          badge: '+4.2% Cost Increase',
          desc: 'Groundnut raw seed commodity prices projected to surge next week. Place a 5-Ton purchase order with AgriCorp Farmers today to save ₹18,000.'
        },
        {
          heading: 'Supplier Reliability Rating Index',
          badge: '99.1% Score',
          desc: 'AgriCorp Farmers ranked highest in moisture consistency and delivery punctuality across 12 recent shipments.'
        }
      ],
      detailedAnalysis: {
        recommendedAction: 'Execute 5-Ton Raw Seed Procurement Order with AgriCorp',
        impactScore: 'Save ₹18,000 in Material Cost',
        historicalData: [
          { batch: 'AgriCorp', score: 99 },
          { batch: 'Sunshine', score: 94 },
          { batch: 'BioSeed', score: 88 }
        ]
      }
    },
    {
      id: 'sales',
      title: 'Sales Flow AI Engine',
      category: 'Wholesale Demand Surge & Margin ML',
      icon: ShoppingBag,
      color: 'purple',
      badgeColor: 'bg-purple-600/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
      accentBorder: 'border-l-4 border-purple-600',
      shortSummary: 'Seasonal demand surges & dynamic price elasticity recommendations.',
      confidence: '98.9%',
      insights: [
        {
          heading: 'Festival Wholesale Demand Surge Forecast',
          badge: '+22% Demand',
          desc: 'Seasonal trend model predicts a 22% increase in Coconut Oil wholesale purchases over the next 14 days.'
        },
        {
          heading: 'Dynamic Price Elasticity Recommendation',
          badge: 'Optimal: ₹195/L',
          desc: 'AI price elasticity model suggests adjusting Sesame Oil price to ₹195/L for a 6.4% profit margin expansion with zero demand drop.'
        }
      ],
      detailedAnalysis: {
        recommendedAction: 'Adjust Sesame Oil Wholesale Pricing to ₹195/L',
        impactScore: '+6.4% Net Profit Expansion',
        historicalData: [
          { batch: 'Retail', revenue: 95000 },
          { batch: 'Wholesale', revenue: 180000 }
        ]
      }
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="p-6 glass-panel rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-extrabold uppercase bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 px-3 py-0.5 rounded-full border border-purple-200 dark:border-purple-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-500 animate-spin" />
              Smart Analytics Engine v3.0
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              Click any section below to ENLARGE & view full AI analysis
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            AI Analytics & Predictive Insights
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click on any department section below to enlarge it into full screen mode with deep telemetry charts.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl">
          <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-pulse" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">AI Core Status</span>
            <p className="text-xs font-bold text-purple-700 dark:text-purple-300">Neural Network Active</p>
          </div>
        </div>
      </div>

      {/* 4 CLEAN CARDS GRID (CLICK TO ENLARGE) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              onClick={() => setActiveModalSection(section)}
              className={`p-6 glass-panel rounded-3xl space-y-4 ${section.accentBorder} hover:scale-[1.01] transition-all cursor-pointer group shadow-sm hover:shadow-xl relative overflow-hidden`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-amber-500 dark:group-hover:text-slate-950 text-slate-700 dark:text-slate-200 rounded-2xl transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-400 transition-colors">
                      {section.title}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{section.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    {section.confidence} Confidence
                  </span>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                    <Maximize2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {section.shortSummary}
              </p>

              <div className="pt-2 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold">{section.insights.length} AI Recommendations</span>
                <span className="text-blue-600 dark:text-amber-400 font-bold group-hover:underline flex items-center gap-1">
                  Enlarge Analysis <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ENLARGED FULL ANALYSIS MODAL */}
      {activeModalSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 overflow-y-auto relative text-slate-900 dark:text-white">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 rounded-2xl">
                  {React.createElement(activeModalSection.icon, { className: 'w-7 h-7' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black">{activeModalSection.title}</h3>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-0.5 rounded-full">
                      {activeModalSection.confidence} Confidence Score
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeModalSection.category}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveModalSection(null)}
                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Enlarged Insights Cards */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Detailed AI Neural Insights & Action Steps
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeModalSection.insights.map((item, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{item.heading}</h5>
                      <span className="text-[10px] font-bold bg-blue-600 dark:bg-amber-500 text-white dark:text-slate-950 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Enlarged Telemetry Chart */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Neural Model Telemetry Chart
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeModalSection.detailedAnalysis.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                    <XAxis dataKey="batch" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
                    <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#cbd5e1',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="yield" fill={isDark ? '#f59e0b' : '#2563eb'} radius={[8, 8, 0, 0]} />
                    <Bar dataKey="stock" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="score" fill="#a855f7" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommended Action Footer Box */}
            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">AI Recommended Executive Action</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{activeModalSection.detailedAnalysis.recommendedAction}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Projected Impact: {activeModalSection.detailedAnalysis.impactScore}</p>
              </div>
              <button
                onClick={() => {
                  alert(`Applied AI Recommendation: ${activeModalSection.detailedAnalysis.recommendedAction}`);
                  setActiveModalSection(null);
                }}
                className="px-5 py-2.5 bg-blue-600 dark:bg-amber-500 hover:bg-blue-700 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                Execute AI Recommendation
              </button>
            </div>

          </div>
        </div>
      )}

      {/* AI DEMAND & REVENUE FORECASTING TIME-SERIES CHART */}
      <div className="p-6 glass-panel rounded-3xl space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              AI Sales & Production Volume Forecast Line
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Actual historical output vs AI neural network forward predictions</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600"></span> Actual</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-500"></span> AI Forecast</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
              <XAxis dataKey="day" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
              <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#0f172a' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#cbd5e1',
                  borderRadius: '16px',
                  color: isDark ? '#ffffff' : '#0f172a',
                  fontSize: '12px'
                }}
                formatter={(val, name) => [`${val ? val.toLocaleString() + ' L' : 'N/A'}`, name === 'aiPredicted' ? 'AI Forecast' : 'Actual Output']}
              />
              <Area type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="aiPredicted" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorAi)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* INTERACTIVE AI SCENARIO SIMULATOR TOOL */}
      <div className="p-6 glass-panel rounded-3xl space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Interactive AI Production & Revenue Simulator</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Adjust planned production liters and price margin below to calculate real-time AI predicted gross revenue and net profit margins.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Slider 1: Production Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-400">Planned Batch Volume</span>
              <span className="text-blue-600 dark:text-amber-400">{simProductionVol.toLocaleString()} Liters</span>
            </div>
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={simProductionVol}
              onChange={(e) => setSimProductionVol(Number(e.target.value))}
              className="w-full accent-blue-600 dark:accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Slider 2: Retail Margin % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-400">Target Retail Markup</span>
              <span className="text-purple-600 dark:text-purple-400">+{simRetailPriceMargin}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={simRetailPriceMargin}
              onChange={(e) => setSimRetailPriceMargin(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Result 1: Predicted Revenue */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-slate-400">AI Predicted Gross Sales</span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">₹{estimatedRevenue.toLocaleString()}</p>
          </div>

          {/* Result 2: Predicted Net Profit */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">AI Predicted Net Profit</span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{estimatedProfit.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
