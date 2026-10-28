import React from 'react';
import { Database, AlertOctagon, ArrowRight, ShieldCheck, Terminal, RefreshCw } from 'lucide-react';
import { DatabaseHealth } from '../types';

interface EmptyOrErrorStateProps {
  health: DatabaseHealth | null;
  onOpenConnect: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const EmptyOrErrorState: React.FC<EmptyOrErrorStateProps> = ({
  health,
  onOpenConnect,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="bg-[#101314] border border-[#2B3338] p-8 space-y-6">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#22282C]">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-[#FF5C8D]/10 border border-[#FF5C8D]/40 text-[#FF5C8D] font-mono font-bold flex items-center justify-center">
              !
            </div>
            <div>
              <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>SYSTEM STATE: OFFLINE</span>
                <span>//</span>
                <span className="text-[#FF5C8D]">CONNECTION REQUIRED</span>
              </div>
              <h2 className="text-xl font-bold font-mono text-white tracking-tight uppercase">
                Awaiting Supabase PostgreSQL Handshake
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#161A1C] hover:bg-[#20262A] text-zinc-300 border border-[#2B3338] transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C7FF3D]' : ''}`} />
              <span>RETRY PING</span>
            </button>
            <button
              onClick={onOpenConnect}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold transition shadow-[0_0_12px_rgba(199,255,61,0.25)]"
            >
              <span>CONNECT DATABASE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Diagnostic Telemetry Output */}
        <div className="bg-[#090B0A] border border-[#22282C] p-4 text-xs font-mono space-y-1.5">
          <div className="flex items-center space-x-2 text-zinc-400">
            <Terminal className="w-4 h-4 text-[#C7FF3D]" />
            <span className="text-zinc-500 uppercase">SYS.DIAGNOSTIC:</span>
            <span className="text-zinc-300">{health?.error || 'DATABASE_URL environment variable is unassigned.'}</span>
          </div>
          <div className="text-[11px] text-zinc-600 pl-6">
            TARGET TABLE: public.sales_data (4,574 Verified Historical Records)
          </div>
        </div>

        {/* Dual Guidance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#090B0A] p-5 border border-[#22282C] space-y-2">
            <div className="flex items-center space-x-2 text-[#C7FF3D] font-bold tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>ANTI-FABRICATION MANDATE</span>
            </div>
            <p className="text-zinc-400 font-sans text-xs leading-relaxed">
              This decision intelligence system prohibits mock data fabrication. All analytics, descriptive quantiles, and anomaly detection algorithms are evaluated directly against your Supabase PostgreSQL cluster.
            </p>
          </div>

          <div className="bg-[#090B0A] p-5 border border-[#22282C] space-y-2">
            <div className="flex items-center space-x-2 text-[#00F0FF] font-bold tracking-wider uppercase">
              <Terminal className="w-4 h-4" />
              <span>DIRECT CONFIGURATION</span>
            </div>
            <p className="text-zinc-400 font-sans text-xs leading-relaxed">
              Click <strong className="text-white">"Connect Database"</strong> above to enter your Supabase connection string, or assign <code className="text-[#C7FF3D] font-mono">DATABASE_URL</code> in your project <code className="text-white font-mono">.env</code>:
            </p>
            <div className="bg-[#121517] p-2 text-[10px] text-zinc-300 border border-[#1F2529] overflow-x-auto">
              DATABASE_URL="postgresql://postgres.[ref]:[pw]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
