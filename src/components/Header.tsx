import React from 'react';
import { Database, Activity, RefreshCw, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { DatabaseHealth } from '../types';

interface HeaderProps {
  health: DatabaseHealth | null;
  onRefresh: () => void;
  onOpenConnect: () => void;
  onOpenAI: () => void;
  isRefreshing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  onRefresh,
  onOpenConnect,
  onOpenAI,
  isRefreshing,
  activeTab,
  setActiveTab,
}) => {
  const isConnected = Boolean(health?.connected);
  const isTargetMatch = Boolean(health?.is_exact_count_match);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeseries', label: 'Time Series' },
    { id: 'yearly', label: 'Yearly Aggregate' },
    { id: 'comparisons', label: 'Comparisons & Correlation' },
    { id: 'statistics', label: 'Descriptive Statistics' },
    { id: 'outliers', label: 'IQR Outlier Detection' },
    { id: 'explorer', label: 'Data Explorer' },
    { id: 'quality', label: 'Data Quality' },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold tracking-tight text-white text-base">FODS Enterprise Decision Support</span>
                <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">FastAPI + Supabase</span>
              </div>
              <p className="text-xs text-slate-400">Foundation of Data Science &bull; public.sales_data</p>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center space-x-3">
            {/* Database Health Badge */}
            <button
              onClick={onOpenConnect}
              className={`flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded border transition-colors ${
                isConnected
                  ? isTargetMatch
                    ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/50'
                    : 'bg-amber-950/60 border-amber-700/60 text-amber-300 hover:bg-amber-900/50'
                  : 'bg-rose-950/60 border-rose-700/60 text-rose-300 hover:bg-rose-900/50'
              }`}
            >
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {health?.record_count?.toLocaleString()} rows
                    {health?.latency_ms ? ` (${health.latency_ms}ms)` : ''}
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Database Offline &bull; Configure</span>
                </>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 text-slate-400 hover:text-white rounded hover:bg-slate-800 border border-transparent hover:border-slate-700 transition disabled:opacity-50"
              title="Refresh Data & Database Check"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            {/* AI Insights Button */}
            <button
              onClick={onOpenAI}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-700/50 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Insights</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-1 border-t border-slate-800/60 py-1.5 scrollbar-thin">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
