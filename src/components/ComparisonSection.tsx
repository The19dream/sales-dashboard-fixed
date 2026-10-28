import React, { useState, useEffect } from 'react';
import { ComparisonsData } from '../types';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Loader2, Network, Binary, Compass, AlertOctagon, ArrowRight } from 'lucide-react';

interface ComparisonSectionProps {
  onOpenConnect?: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onOpenConnect }) => {
  const [data, setData] = useState<ComparisonsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComp = async () => {
      setLoading(true);
      try {
        const res = await api.getComparisons();
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to compute correlation and shares');
      } finally {
        setLoading(false);
      }
    };
    fetchComp();
  }, []);

  const allMetrics = ['Q-P1', 'Q-P2', 'Q-P3', 'Q-P4', 'S-P1', 'S-P2', 'S-P3', 'S-P4'];

  const getCellTheme = (val: number) => {
    if (val === 1) return 'bg-[#C7FF3D] text-[#090B0A] font-bold';
    if (val > 0.6) return 'bg-[#C7FF3D]/25 text-[#C7FF3D] font-bold border border-[#C7FF3D]/40';
    if (val > 0.3) return 'bg-[#C7FF3D]/10 text-emerald-300';
    if (val < -0.6) return 'bg-[#FF5C8D]/30 text-[#FF5C8D] font-bold border border-[#FF5C8D]/40';
    if (val < -0.3) return 'bg-[#FF5C8D]/10 text-rose-300';
    return 'bg-[#090B0A] text-zinc-500';
  };

  const defaultQComparison = [
    { metric: 'Q-P1', total: 0, share_of_group_pct: 25, median: 0 },
    { metric: 'Q-P2', total: 0, share_of_group_pct: 25, median: 0 },
    { metric: 'Q-P3', total: 0, share_of_group_pct: 25, median: 0 },
    { metric: 'Q-P4', total: 0, share_of_group_pct: 25, median: 0 },
  ];

  const defaultSComparison = [
    { metric: 'S-P1', total: 0, share_of_group_pct: 25, median: 0 },
    { metric: 'S-P2', total: 0, share_of_group_pct: 25, median: 0 },
    { metric: 'S-P3', total: 0, share_of_group_pct: 25, median: 0 },
    { metric: 'S-P4', total: 0, share_of_group_pct: 25, median: 0 },
  ];

  const qData = data?.q_comparison || defaultQComparison;
  const sData = data?.s_comparison || defaultSComparison;

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#101314] border border-[#22282C] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#6B7780] tracking-widest uppercase mb-1">
            <span>MODULE // 04</span>
            <span>//</span>
            <span className={data ? "text-[#C7FF3D]" : "text-amber-400"}>
              {data ? "CROSS-DIMENSIONAL COUPLING" : "STANDBY CONFIGURATION"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight uppercase">
            Dimension Shares & Pearson Correlation Matrix
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Inter-metric co-dependence, dimensional weight allocations, and multi-variable coupling across 4,574 observations.
          </p>
        </div>

        {!data && onOpenConnect && (
          <button
            onClick={onOpenConnect}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold text-xs font-mono shrink-0"
          >
            <span>CONNECT DATABASE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-3 text-xs font-mono text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-[#C7FF3D]" />
          <span>COMPUTING 8×8 PEARSON CORRELATION MATRIX VIA POSTGRESQL CORR()...</span>
        </div>
      ) : (
        <>
          {/* Side-by-Side Product Share Analyzers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Q Group */}
            <div className="bg-[#101314] border border-[#22282C] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#22282C] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#C7FF3D] tracking-widest uppercase">DIMENSION Q</span>
                  <h3 className="text-sm font-bold font-mono text-white">Product Share Distribution</h3>
                </div>
                <span className="text-xs font-mono text-zinc-400">P1 &rarr; P4</span>
              </div>

              <div className="h-56 w-full">
                {data ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={qData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="1 3" stroke="#1A1F23" vertical={false} />
                      <XAxis dataKey="metric" stroke="#6B7780" tick={{ fill: '#8E9A9E', fontSize: 11, fontFamily: 'monospace' }} />
                      <YAxis stroke="#6B7780" tick={{ fill: '#8E9A9E', fontSize: 11, fontFamily: 'monospace' }} tickFormatter={(val) => val.toLocaleString()} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090B0A', borderColor: '#22282C', borderRadius: '0px', fontFamily: 'monospace', fontSize: '11px' }}
                        formatter={(val: any) => [Number(val).toLocaleString(), 'Volume Total']}
                      />
                      <Bar dataKey="total" fill="#C7FF3D" radius={[0, 0, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs font-mono text-zinc-500 border border-dashed border-[#1C2125]">
                    AWAITING DB QUERY FOR Q SHARES
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1C2125]">
                {qData.map((m) => (
                  <div key={m.metric} className="bg-[#090B0A] p-2.5 border border-[#22282C] text-center font-mono">
                    <div className="text-[11px] text-[#C7FF3D] font-bold">{m.metric}</div>
                    <div className="text-sm font-black text-white mt-0.5">{data ? `${m.share_of_group_pct}%` : '---'}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">MED: {data ? m.median : '---'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* S Group */}
            <div className="bg-[#101314] border border-[#22282C] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#22282C] pb-3">
                <div>
                  <span className="text-[10px] font-mono text-[#00F0FF] tracking-widest uppercase">DIMENSION S</span>
                  <h3 className="text-sm font-bold font-mono text-white">Product Share Distribution</h3>
                </div>
                <span className="text-xs font-mono text-zinc-400">P1 &rarr; P4</span>
              </div>

              <div className="h-56 w-full">
                {data ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="1 3" stroke="#1A1F23" vertical={false} />
                      <XAxis dataKey="metric" stroke="#6B7780" tick={{ fill: '#8E9A9E', fontSize: 11, fontFamily: 'monospace' }} />
                      <YAxis stroke="#6B7780" tick={{ fill: '#8E9A9E', fontSize: 11, fontFamily: 'monospace' }} tickFormatter={(val) => val.toLocaleString()} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#090B0A', borderColor: '#22282C', borderRadius: '0px', fontFamily: 'monospace', fontSize: '11px' }}
                        formatter={(val: any) => [Number(val).toLocaleString(), 'Volume Total']}
                      />
                      <Bar dataKey="total" fill="#00F0FF" radius={[0, 0, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs font-mono text-zinc-500 border border-dashed border-[#1C2125]">
                    AWAITING DB QUERY FOR S SHARES
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1C2125]">
                {sData.map((m) => (
                  <div key={m.metric} className="bg-[#090B0A] p-2.5 border border-[#22282C] text-center font-mono">
                    <div className="text-[11px] text-[#00F0FF] font-bold">{m.metric}</div>
                    <div className="text-sm font-black text-white mt-0.5">{data ? `${m.share_of_group_pct}%` : '---'}</div>
                    <div className="text-[9px] text-zinc-500 mt-0.5">MED: {data ? m.median : '---'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 8x8 Scientific Correlation Heatmap */}
          <div className="bg-[#101314] border border-[#22282C] p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22282C] pb-4">
              <div>
                <div className="text-[10px] font-mono text-[#C7FF3D] tracking-widest uppercase">PRECISION INSTRUMENT</div>
                <h3 className="text-sm font-bold font-mono text-white tracking-wider flex items-center space-x-2">
                  <Network className="w-4 h-4 text-[#C7FF3D]" />
                  <span>PEARSON CORRELATION MATRIX (8 × 8 CHANNELS)</span>
                </h3>
              </div>
              <div className="flex items-center space-x-3 text-[10px] font-mono">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-[#C7FF3D] inline-block" />
                  <span className="text-zinc-300">HIGH (+0.6)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-[#090B0A] border border-[#22282C] inline-block" />
                  <span className="text-zinc-500">NEUTRAL</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 bg-[#FF5C8D] inline-block" />
                  <span className="text-zinc-300">INVERSE (-0.3)</span>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-left font-mono text-zinc-500 bg-[#090B0A] border border-[#22282C]">CHANNEL</th>
                    {allMetrics.map((col) => (
                      <th key={col} className="p-3 font-mono text-zinc-300 bg-[#090B0A] border border-[#22282C]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allMetrics.map((rowName) => (
                    <tr key={rowName}>
                      <td className="p-3 text-left font-mono font-bold text-white bg-[#090B0A] border border-[#22282C]">
                        {rowName}
                      </td>
                      {allMetrics.map((colName) => {
                        const corr = data?.correlation_matrix?.[rowName]?.[colName] ?? (rowName === colName ? 1.0 : 0.0);
                        return (
                          <td
                            key={colName}
                            className={`p-3 font-mono text-xs border border-[#22282C] transition-all hover:ring-1 hover:ring-[#C7FF3D] cursor-default ${data ? getCellTheme(corr) : 'bg-[#090B0A] text-zinc-600'}`}
                            title={`Correlation (${rowName} <-> ${colName}): ${corr}`}
                          >
                            {corr.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
