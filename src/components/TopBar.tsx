import React from 'react';
import { DatabaseHealth } from '../types';
import { Terminal, Database, Activity, Sparkles, ExternalLink } from 'lucide-react';

interface TopBarProps {
  health: DatabaseHealth | null;
  onOpenConnect: () => void;
  onOpenAI: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ health, onOpenConnect, onOpenAI }) => {
  const isConnected = Boolean(health?.connected);

  return (
    <header className="border-b border-[#22282C] bg-[#090B0A] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono tracking-widest text-[#C7FF3D] uppercase bg-[#C7FF3D]/10 px-1.5 py-0.5 border border-[#C7FF3D]/30">
            SYSTEM DIRECTIVE
          </span>
          <span className="text-xs font-mono text-zinc-500">//</span>
          <span className="text-xs font-mono text-zinc-400">FOUNDATION OF DATA SCIENCE</span>
        </div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-white font-mono mt-1 flex items-center space-x-2">
          <span>DECISION INTELLIGENCE</span>
          <span className="text-[#C7FF3D]">/ 01</span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Technical telemetry string */}
        <div className="hidden xl:flex items-center space-x-3 text-[11px] font-mono text-zinc-500 bg-[#101314] px-3 py-1.5 border border-[#22282C]">
          <span>TARGET: 4,574 ROWS</span>
          <span>&bull;</span>
          <span>RANGE: 2010-06-13 &rarr; 2023-02-03</span>
          <span>&bull;</span>
          <span className="text-zinc-400">SCHEMA: PUBLIC.SALES_DATA</span>
        </div>

        {/* Database Handshake Badge */}
        <button
          onClick={onOpenConnect}
          className={`px-3 py-1.5 text-xs font-mono border transition flex items-center space-x-2 ${
            isConnected
              ? 'bg-[#101314] border-[#2B3338] hover:border-[#C7FF3D] text-zinc-200'
              : 'bg-rose-950/40 border-rose-800 text-rose-300 hover:bg-rose-900/50'
          }`}
        >
          <span className={`w-2 h-2 ${isConnected ? 'bg-[#C7FF3D]' : 'bg-rose-500'} inline-block`} />
          <span className="tracking-wider">
            {isConnected ? `SUPABASE: ${health?.record_count?.toLocaleString()} ROWS` : 'CONNECT DATABASE'}
          </span>
        </button>

        {/* Gemini AI Action */}
        <button
          onClick={onOpenAI}
          className="px-3 py-1.5 text-xs font-mono bg-[#161A1C] hover:bg-[#1E2327] border border-[#00F0FF]/40 text-[#00F0FF] hover:text-white transition flex items-center space-x-1.5 shadow-[0_0_10px_rgba(0,240,255,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="tracking-wider">AI SYNTHESIS</span>
        </button>
      </div>
    </header>
  );
};
