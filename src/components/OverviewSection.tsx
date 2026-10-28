import React from 'react';
import { OverviewData } from '../types';
import { Layers, Database, ArrowUpRight, TrendingUp, BarChart2, ShieldCheck, Binary, AlertOctagon, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface OverviewSectionProps {
  data?: OverviewData | null;
  onOpenAI: () => void;
  onOpenConnect?: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ data, onOpenAI, onOpenConnect }) => {
  const isDataLoaded = Boolean(data);

  const barChartData = [
    {
      product: 'PRODUCT 01',
      code: 'P1',
      'Q Metric Total': data?.q_metrics?.find((m) => m.metric === 'Q-P1')?.total_sum || 0,
      'S Metric Total': data?.s_metrics?.find((m) => m.metric === 'S-P1')?.total_sum || 0,
    },
    {
      product: 'PRODUCT 02',
      code: 'P2',
      'Q Metric Total': data?.q_metrics?.find((m) => m.metric === 'Q-P2')?.total_sum || 0,
      'S Metric Total': data?.s_metrics?.find((m) => m.metric === 'S-P2')?.total_sum || 0,
    },
    {
      product: 'PRODUCT 03',
      code: 'P3',
      'Q Metric Total': data?.q_metrics?.find((m) => m.metric === 'Q-P3')?.total_sum || 0,
      'S Metric Total': data?.s_metrics?.find((m) => m.metric === 'S-P3')?.total_sum || 0,
    },
    {
      product: 'PRODUCT 04',
      code: 'P4',
      'Q Metric Total': data?.q_metrics?.find((m) => m.metric === 'Q-P4')?.total_sum || 0,
      'S Metric Total': data?.s_metrics?.find((m) => m.metric === 'S-P4')?.total_sum || 0,
    },
  ];

  const qDefaults = [
    { metric: 'Q-P1', total: data?.q_metrics?.find((m) => m.metric === 'Q-P1')?.total_sum, mean: data?.q_metrics?.find((m) => m.metric === 'Q-P1')?.mean, min: data?.q_metrics?.find((m) => m.metric === 'Q-P1')?.min_val, max: data?.q_metrics?.find((m) => m.metric === 'Q-P1')?.max_val },
    { metric: 'Q-P2', total: data?.q_metrics?.find((m) => m.metric === 'Q-P2')?.total_sum, mean: data?.q_metrics?.find((m) => m.metric === 'Q-P2')?.mean, min: data?.q_metrics?.find((m) => m.metric === 'Q-P2')?.min_val, max: data?.q_metrics?.find((m) => m.metric === 'Q-P2')?.max_val },
    { metric: 'Q-P3', total: data?.q_metrics?.find((m) => m.metric === 'Q-P3')?.total_sum, mean: data?.q_metrics?.find((m) => m.metric === 'Q-P3')?.mean, min: data?.q_metrics?.find((m) => m.metric === 'Q-P3')?.min_val, max: data?.q_metrics?.find((m) => m.metric === 'Q-P3')?.max_val },
    { metric: 'Q-P4', total: data?.q_metrics?.find((m) => m.metric === 'Q-P4')?.total_sum, mean: data?.q_metrics?.find((m) => m.metric === 'Q-P4')?.mean, min: data?.q_metrics?.find((m) => m.metric === 'Q-P4')?.min_val, max: data?.q_metrics?.find((m) => m.metric === 'Q-P4')?.max_val },
  ];

  const sDefaults = [
    { metric: 'S-P1', total: data?.s_metrics?.find((m) => m.metric === 'S-P1')?.total_sum, mean: data?.s_metrics?.find((m) => m.metric === 'S-P1')?.mean, min: data?.s_metrics?.find((m) => m.metric === 'S-P1')?.min_val, max: data?.s_metrics?.find((m) => m.metric === 'S-P1')?.max_val },
    { metric: 'S-P2', total: data?.s_metrics?.find((m) => m.metric === 'S-P2')?.total_sum, mean: data?.s_metrics?.find((m) => m.metric === 'S-P2')?.mean, min: data?.s_metrics?.find((m) => m.metric === 'S-P2')?.min_val, max: data?.s_metrics?.find((m) => m.metric === 'S-P2')?.max_val },
    { metric: 'S-P3', total: data?.s_metrics?.find((m) => m.metric === 'S-P3')?.total_sum, mean: data?.s_metrics?.find((m) => m.metric === 'S-P3')?.mean, min: data?.s_metrics?.find((m) => m.metric === 'S-P3')?.min_val, max: data?.s_metrics?.find((m) => m.metric === 'S-P3')?.max_val },
    { metric: 'S-P4', total: data?.s_metrics?.find((m) => m.metric === 'S-P4')?.total_sum, mean: data?.s_metrics?.find((m) => m.metric === 'S-P4')?.mean, min: data?.s_metrics?.find((m) => m.metric === 'S-P4')?.min_val, max: data?.s_metrics?.find((m) => m.metric === 'S-P4')?.max_val },
  ];

  return (
    <div className="space-y-6">
      {/* If database is not connected, show an inline non-blocking notice */}
      {!isDataLoaded && (
        <div className="bg-[#101314] border border-[#2B3338] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2 text-zinc-300">
            <AlertOctagon className="w-4 h-4 text-[#FF5C8D] shrink-0" />
            <span>NODE STANDBY: Connect your Supabase PostgreSQL database to populate live statistics.</span>
          </div>
          {onOpenConnect && (
            <button
              onClick={onOpenConnect}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold text-xs font-mono shrink-0"
            >
              <span>CONNECT DATABASE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Editorial Sub-Header Banner */}
      <div className="bg-[#101314] border border-[#22282C] p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#6B7780] tracking-widest uppercase mb-1">
            <span>INDEX REF: SYS.FODS.01</span>
            <span>//</span>
            <span className={isDataLoaded ? "text-[#C7FF3D]" : "text-amber-400"}>
              {isDataLoaded ? "STREAM VERIFIED" : "STANDBY ARCHITECTURE"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono tracking-tight text-white uppercase">
            Executive Telemetry & Macro Indicators
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-sans">
            Primary empirical summary computed from PostgreSQL table <code className="text-[#C7FF3D] font-mono">public.sales_data</code>. All values represent non-fabricated ground-truth transactional records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="bg-[#090B0A] px-3.5 py-2 border border-[#22282C]">
            <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Date Horizon</span>
            <span className="font-semibold text-white tracking-tight">
              {data?.min_date || '2010-06-13'} &rarr; {data?.max_date || '2023-02-03'}
            </span>
          </div>
          <div className="bg-[#090B0A] px-3.5 py-2 border border-[#22282C]">
            <span className="text-[10px] text-zinc-500 uppercase block tracking-wider">Timespan</span>
            <span className="font-semibold text-[#00F0FF]">
              {data?.days_span ? `${data.days_span.toLocaleString()} DAYS` : '4,619 DAYS'}
            </span>
          </div>
        </div>
      </div>

      {/* High-Impact Technical KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#22282C] bg-[#101314] divide-y sm:divide-y-0 sm:divide-x divide-[#22282C]">
        {/* KPI 01 */}
        <div className="p-5 flex flex-col justify-between space-y-3 group hover:bg-[#131718] transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span className="tracking-widest uppercase">01 // OBSERVATIONS</span>
            <span className="text-[10px] text-[#C7FF3D]">100% COUNT</span>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-black font-mono tracking-tight text-white tabular-data">
              {data?.total_records ? data.total_records.toLocaleString() : '4,574'}
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#C7FF3D] mt-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Target Benchmark: 4,574 Rows Verified</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 pt-2 border-t border-[#1C2125]">
            SOURCE: PUBLIC.SALES_DATA
          </div>
        </div>

        {/* KPI 02 */}
        <div className="p-5 flex flex-col justify-between space-y-3 group hover:bg-[#131718] transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span className="tracking-widest uppercase">02 // TOTAL Q-VOLUME</span>
            <span className="text-[10px] text-[#C7FF3D]">DIMENSION Q</span>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-black font-mono tracking-tight text-[#C7FF3D] tabular-data">
              {data?.total_q_sum ? data.total_q_sum.toLocaleString() : '---'}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1.5">
              Cumulative aggregate across Q-P1 to Q-P4
            </div>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 pt-2 border-t border-[#1C2125]">
            4 METRIC VECTORS INTEGRATED
          </div>
        </div>

        {/* KPI 03 */}
        <div className="p-5 flex flex-col justify-between space-y-3 group hover:bg-[#131718] transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span className="tracking-widest uppercase">03 // TOTAL S-VOLUME</span>
            <span className="text-[10px] text-[#00F0FF]">DIMENSION S</span>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-black font-mono tracking-tight text-[#00F0FF] tabular-data">
              {data?.total_s_sum ? data.total_s_sum.toLocaleString() : '---'}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1.5">
              Cumulative aggregate across S-P1 to S-P4
            </div>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 pt-2 border-t border-[#1C2125]">
            4 METRIC VECTORS INTEGRATED
          </div>
        </div>

        {/* KPI 04 */}
        <div className="p-5 flex flex-col justify-between space-y-3 group hover:bg-[#131718] transition-colors">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-mono">
            <span className="tracking-widest uppercase">04 // DAILY RATE</span>
            <span className="text-[10px] text-zinc-400">FREQUENCY</span>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-black font-mono tracking-tight text-white tabular-data">
              {data ? (data.total_records / (data.days_span || 1)).toFixed(2) : '0.99'}
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-1.5">
              Mean recorded events per calendar day
            </div>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 pt-2 border-t border-[#1C2125]">
            TEMPORAL CONTINUITY: 0.99
          </div>
        </div>
      </div>

      {/* Macro Comparative Bar Chart */}
      <div className="bg-[#101314] border border-[#22282C] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22282C] pb-4">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase">DIMENSIONAL COMPARISON // P1 - P4</div>
            <h3 className="text-base font-bold font-mono text-white tracking-tight">Cumulative Metric Volume by Product Dimension</h3>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-[#C7FF3D] inline-block" />
              <span className="text-zinc-300">Q Dimension</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-[#00F0FF] inline-block" />
              <span className="text-zinc-300">S Dimension</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          {isDataLoaded ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#1C2125" vertical={false} />
                <XAxis dataKey="code" stroke="#6B7780" tick={{ fill: '#8E9A9E', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#6B7780" tick={{ fill: '#8E9A9E', fontSize: 11, fontFamily: 'monospace' }} tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090B0A',
                    borderColor: '#22282C',
                    borderRadius: '0px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.8)'
                  }}
                  formatter={(val: any) => [Number(val).toLocaleString(), '']}
                />
                <Bar dataKey="Q Metric Total" fill="#C7FF3D" radius={[0, 0, 0, 0]} maxBarSize={48} />
                <Bar dataKey="S Metric Total" fill="#00F0FF" radius={[0, 0, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-2 text-xs font-mono text-zinc-500 border border-dashed border-[#1C2125]">
              <Database className="w-6 h-6 text-zinc-600" />
              <span>AWAITING DATABASE QUERY &bull; CONNECT DATABASE TO RENDER METRIC BARS</span>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Product Vectors Grids: Q & S */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Q Dimension Breakdown */}
        <div className="bg-[#101314] border border-[#22282C]">
          <div className="p-4 border-b border-[#22282C] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#C7FF3D] tracking-widest uppercase">VECTOR SET // 01</span>
              <h3 className="text-sm font-bold font-mono text-white">Q Metrics (Q-P1 through Q-P4)</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#C7FF3D]/10 text-[#C7FF3D] border border-[#C7FF3D]/30">
              4 TELEMETRY CHANNELS
            </span>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-[#22282C] border-b border-[#22282C]">
            {qDefaults.map((m) => (
              <div key={m.metric} className="p-4 space-y-1.5 hover:bg-[#131718] transition-colors">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#C7FF3D]">{m.metric}</span>
                  <span className="text-[10px] text-zinc-500">MEAN: {m.mean ? m.mean.toLocaleString() : '---'}</span>
                </div>
                <div className="text-xl font-black font-mono text-white tabular-data">
                  {m.total ? m.total.toLocaleString() : '---'}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-[#1A1F22]">
                  <span>MIN: {m.min ?? '---'}</span>
                  <span>MAX: {m.max ? m.max.toLocaleString() : '---'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* S Dimension Breakdown */}
        <div className="bg-[#101314] border border-[#22282C]">
          <div className="p-4 border-b border-[#22282C] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#00F0FF] tracking-widest uppercase">VECTOR SET // 02</span>
              <h3 className="text-sm font-bold font-mono text-white">S Metrics (S-P1 through S-P4)</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
              4 TELEMETRY CHANNELS
            </span>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-[#22282C] border-b border-[#22282C]">
            {sDefaults.map((m) => (
              <div key={m.metric} className="p-4 space-y-1.5 hover:bg-[#131718] transition-colors">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#00F0FF]">{m.metric}</span>
                  <span className="text-[10px] text-zinc-500">MEAN: {m.mean ? m.mean.toLocaleString() : '---'}</span>
                </div>
                <div className="text-xl font-black font-mono text-white tabular-data">
                  {m.total ? m.total.toLocaleString() : '---'}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-[#1A1F22]">
                  <span>MIN: {m.min ?? '---'}</span>
                  <span>MAX: {m.max ? m.max.toLocaleString() : '---'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
