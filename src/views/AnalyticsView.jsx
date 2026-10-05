import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  Car, 
  Flame, 
  MapPin, 
  Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function AnalyticsView() {
  const { analytics, currentUser } = useApp();

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-teal-400" /> Reports & Sustainability Analytics
        </h1>
        <p className="text-xs text-slate-400">Enterprise mobility insights, fuel consumption trends, cost per kilometer analysis, and CO₂ metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Shared Trips</span>
            <Car className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics.totalTripsCompleted}</div>
          <p className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18% increase this quarter
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Distance</span>
            <MapPin className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{analytics.totalDistanceKm} <span className="text-xs font-normal text-slate-400">km</span></div>
          <p className="text-[11px] text-slate-400 mt-1">Shared corporate commuting</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Est. Fuel Saved</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300">1,240 <span className="text-xs font-normal text-slate-400">Liters</span></div>
          <p className="text-[11px] text-amber-400 mt-1">~$1,650 fuel expenditure saved</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>CO₂ Reduced</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{analytics.co2SavedKg} <span className="text-xs font-normal text-slate-400">kg</span></div>
          <p className="text-[11px] text-emerald-300 mt-1">~{Math.round(analytics.co2SavedKg / 20)} Trees offset equivalent</p>
        </div>
      </div>

      {/* Chart 1: Monthly Commute & CO2 Trends */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" /> Monthly Trip Growth & CO₂ Reduction Trends
            </h3>
            <p className="text-xs text-slate-400">Historical performance across all registered organization branches</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.monthlyTrends}>
              <defs>
                <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#714B67" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#714B67" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00A09D" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00A09D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Area type="monotone" dataKey="trips" name="Completed Shared Rides" stroke="#714B67" fillOpacity={1} fill="url(#colorTrips)" />
              <Area type="monotone" dataKey="co2" name="CO₂ Saved (kg)" stroke="#00A09D" fillOpacity={1} fill="url(#colorCo2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Vehicle-wise Cost & Efficiency Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Car className="w-4 h-4 text-teal-400" /> Vehicle-wise Cost & Emission Analysis
          </h3>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.vehicleWiseAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avgCo2Saved" name="Avg CO₂ Saved per trip (kg)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="costPerKm" name="Est. Cost per KM ($)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enterprise Sustainability Scorecard */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Corporate Sustainability Scorecard
            </h3>
            <p className="text-xs text-slate-400">Automated assessment for {currentUser.orgName}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Green Commute Rating:</span>
              <span className="text-emerald-400 font-black">A+ (Top 5%)</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full w-[88%]" />
            </div>

            <div className="space-y-1 text-slate-400 pt-1 text-[11px]">
              <p>• <strong>68% of shared rides</strong> conducted in Electric or Hybrid vehicles.</p>
              <p>• <strong>$685 saved in individual employee fuel budgets</strong> this month alone.</p>
            </div>
          </div>

          <div className="text-[11px] text-teal-300 bg-teal-950/40 p-3 rounded-xl border border-teal-500/30">
            🌿 <strong>AI Eco Recommendation:</strong> Encouraging 15 more employee carpoolers along the Downtown corridor will save an extra 180 kg of CO₂ monthly!
          </div>
        </div>

      </div>

    </div>
  );
}
