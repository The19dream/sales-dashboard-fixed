import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  Calendar,
  Network,
  Calculator,
  AlertOctagon,
  TableProperties,
  ShieldCheck,
  Cpu,
  Settings2,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { DatabaseHealth } from '../types';

interface NavigationRailProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  health: DatabaseHealth | null;
  onRefresh: () => void;
  onOpenConnect: () => void;
  onOpenAI: () => void;
  isRefreshing: boolean;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  setActiveTab,
  health,
  onRefresh,
  onOpenConnect,
  onOpenAI,
  isRefreshing,
}) => {
  const isConnected = Boolean(health?.connected);

  const navItems = [
    { id: 'overview', index: '01', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'timeseries', index: '02', label: 'TIME-SERIES', icon: LineChart },
    { id: 'yearly', index: '03', label: 'YEARLY TRENDS', icon: Calendar },
    { id: 'comparisons', index: '04', label: 'CORRELATION MATRIX', icon: Network },
    { id: 'statistics', index: '05', label: 'DESCRIPTIVE STATS', icon: Calculator },
    { id: 'outliers', index: '06', label: 'IQR OUTLIERS', icon: AlertOctagon },
    { id: 'explorer', index: '07', label: 'DATA EXPLORER', icon: TableProperties },
    { id: 'quality', index: '08', label: 'SCHEMA AUDIT', icon: ShieldCheck },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#0D0F10] border-b lg:border-b-0 lg:border-r border-[#22282C] flex flex-col justify-between shrink-0 select-none">
      {/* Brand & Top Status */}
      <div>
        <div className="p-4 lg:p-5 border-b border-[#22282C] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-[#C7FF3D] text-[#090B0A] font-mono font-bold text-xs flex items-center justify-center rounded-none shadow-[0_0_12px_rgba(199,255,61,0.25)]">
              NX
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-mono font-bold text-xs tracking-wider text-white">NEXUS // FODS</span>
                <span className="text-[9px] font-mono bg-[#181C1E] text-[#C7FF3D] px-1 py-0.2 border border-[#2B3338]">v2.4</span>
              </div>
              <p className="text-[10px] font-mono text-[#6B7780] tracking-tight uppercase">Decision Intelligence Lab</p>
            </div>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 text-[#6B7780] hover:text-[#C7FF3D] hover:bg-[#161A1C] border border-transparent hover:border-[#22282C] transition disabled:opacity-50"
            title="Refresh Realtime Database Handshake"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C7FF3D]' : ''}`} />
          </button>
        </div>

        {/* Database Diagnostic Ticker */}
        <div className="px-4 py-2.5 bg-[#090B0A] border-b border-[#22282C] text-[10px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7780] uppercase tracking-wider flex items-center space-x-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-[#C7FF3D] animate-pulse' : 'bg-rose-500'}`} />
              <span>{isConnected ? 'NODE ONLINE' : 'NODE OFFLINE'}</span>
            </span>
            <span className="text-zinc-400">
              {health?.latency_ms ? `${health.latency_ms}ms` : '--'}
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-400 mt-1">
            <span>PUBLIC.SALES_DATA</span>
            <span className={health?.is_exact_count_match ? 'text-[#C7FF3D] font-semibold' : 'text-zinc-500'}>
              {health?.record_count ? `${health.record_count.toLocaleString()} REC` : 'AWAITING CONN'}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1 overflow-x-auto lg:overflow-visible flex lg:flex-col">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono transition-all relative whitespace-nowrap ${
                  isActive
                    ? 'bg-[#161A1C] text-white border-l-2 border-[#C7FF3D]'
                    : 'text-[#6B7780] hover:text-zinc-200 hover:bg-[#121517] border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#C7FF3D]' : 'text-[#6B7780] group-hover:text-zinc-300'}`} />
                  <span className="tracking-wider">{item.label}</span>
                </div>
                <span className={`text-[9px] font-mono ${isActive ? 'text-[#C7FF3D]' : 'text-zinc-600'}`}>
                  {item.index}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions Rail */}
      <div className="p-3 border-t border-[#22282C] space-y-2 bg-[#090B0A]">
        {/* AI Synthesis Launcher */}
        <button
          onClick={onOpenAI}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#101314] hover:bg-[#161A1C] border border-[#2B3338] hover:border-[#C7FF3D]/50 text-xs font-mono text-zinc-300 hover:text-white transition group"
        >
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-[#00F0FF] group-hover:text-[#C7FF3D] transition-colors" />
            <span className="tracking-wider">GEMINI SYNTHESIS</span>
          </div>
          <span className="text-[9px] text-[#00F0FF] font-mono uppercase bg-[#00F0FF]/10 px-1 py-0.5 border border-[#00F0FF]/30">AI</span>
        </button>

        {/* Database Config Button */}
        <button
          onClick={onOpenConnect}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#101314] hover:bg-[#161A1C] border border-[#2B3338] text-xs font-mono text-zinc-400 hover:text-zinc-200 transition"
        >
          <div className="flex items-center space-x-2">
            <Settings2 className="w-3.5 h-3.5 text-zinc-500" />
            <span className="tracking-wider">DB HANDSHAKE</span>
          </div>
          <span className="text-[9px] text-zinc-500 font-mono">CFG</span>
        </button>
      </div>
    </aside>
  );
};
