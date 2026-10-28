import React, { useState, useEffect } from 'react';
import { YearlyAggregateItem } from '../types';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Loader2, ArrowUpRight, ArrowDownRight, Minus, Calendar } from 'lucide-react';

interface YearlySectionProps {
  onOpenConnect?: () => void;
}

export const YearlySection: React.FC<YearlySectionProps> = ({ onOpenConnect }) => {
  const [data, setData] = useState<YearlyAggregateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupView, setGroupView] = useState<'AGGREGATES' | 'Q_PRODUCTS' | 'S_PRODUCTS'>('AGGREGATES');

  useEffect(() => {
    const fetchYearly = async () => {
      setLoading(true);
      try {
        const res = await api.getYearly();
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to load yearly aggregates');
      } finally {
        setLoading(false);
      }
    };
    fetchYearly();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3 text-xs font-mono text-zinc-400">
        <Loader2 className="w-6 h-6 animate-spin text-[#C7FF3D]" />
        <span>COMPUTING MULTI-YEAR SQL AGGREGATIONS (2010 - 2023)...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#101314] border border-[#22282C] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#6B7780] tracking-widest uppercase mb-1">
            <span>MODULE // 03</span>
            <span>//</span>
            <span className="text-[#C7FF3D]">ANNUAL CYCLICALITY</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight uppercase">
            Yearly Aggregate Dynamics & YoY Variances
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Annual trajectory from 2010 through 2023 showing macro volume allocations and YoY volatility.
          </p>
        </div>

        <div className="flex border border-[#2B3338] bg-[#090B0A] p-0.5 text-xs font-mono">
          <button
            onClick={() => setGroupView('AGGREGATES')}
            className={`px-3 py-1.5 transition ${
              groupView === 'AGGREGATES' ? 'bg-[#C7FF3D] text-[#090B0A] font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            MACRO TOTALS
          </button>
          <button
            onClick={() => setGroupView('Q_PRODUCTS')}
            className={`px-3 py-1.5 transition ${
              groupView === 'Q_PRODUCTS' ? 'bg-[#C7FF3D] text-[#090B0A] font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Q VECTORS
          </button>
          <button
            onClick={() => setGroupView('S_PRODUCTS')}
            className={`px-3 py-1.5 transition ${
              groupView === 'S_PRODUCTS' ? 'bg-[#00F0FF] text-[#090B0A] font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            S VECTORS
          </button>
        </div>
      </div>

      {/* Stacked Chart Canvas */}
      <div className="bg-[#101314] border border-[#22282C] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#22282C] pb-4">
          <h3 className="text-sm font-bold font-mono text-white tracking-wider">
            ANNUAL VOLUME COMPOSITION MATRIX (2010 – 2023)
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">
            TOTAL CHRONOLOGICAL HORIZON: 14 YEARS
          </span>
        </div>

        <div className="h-80 w-full pt-2">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 15, right: 25, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="1 3" stroke="#1A1F23" vertical={false} />
                <XAxis dataKey="year" stroke="#4A5560" tick={{ fill: '#8E9A9E', fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#4A5560" tick={{ fill: '#8E9A9E', fontSize: 11, fontFamily: 'monospace' }} tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#090B0A',
                    borderColor: '#22282C',
                    borderRadius: '0px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                  }}
                  formatter={(val: any) => [Number(val).toLocaleString(), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }} />
                {groupView === 'AGGREGATES' && (
                  <>
                    <Bar dataKey="q_total_sum" name="Q Dimension Total" fill="#C7FF3D" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="s_total_sum" name="S Dimension Total" fill="#00F0FF" radius={[0, 0, 0, 0]} />
                  </>
                )}
                {groupView === 'Q_PRODUCTS' && (
                  <>
                    <Bar dataKey="qp1_sum" name="Q-P1" fill="#C7FF3D" stackId="a" />
                    <Bar dataKey="qp2_sum" name="Q-P2" fill="#9EE02A" stackId="a" />
                    <Bar dataKey="qp3_sum" name="Q-P3" fill="#66D9EF" stackId="a" />
                    <Bar dataKey="qp4_sum" name="Q-P4" fill="#00B8D9" stackId="a" />
                  </>
                )}
                {groupView === 'S_PRODUCTS' && (
                  <>
                    <Bar dataKey="sp1_sum" name="S-P1" fill="#FF5C8D" stackId="b" />
                    <Bar dataKey="sp2_sum" name="S-P2" fill="#FF944D" stackId="b" />
                    <Bar dataKey="sp3_sum" name="S-P3" fill="#B388FF" stackId="b" />
                    <Bar dataKey="sp4_sum" name="S-P4" fill="#7C4DFF" stackId="b" />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 space-y-3 text-center border border-dashed border-[#22282C]">
              <Calendar className="w-8 h-8 text-zinc-600" />
              <div className="text-xs font-mono text-zinc-400">
                AWAITING SUPABASE DATABASE HANDSHAKE FOR YEARLY AGGREGATES (2010 – 2023)
              </div>
              {onOpenConnect && (
                <button
                  onClick={onOpenConnect}
                  className="px-3 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold text-xs font-mono transition"
                >
                  CONNECT DATABASE
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* High-Density YoY Matrix Table */}
      <div className="bg-[#101314] border border-[#22282C] overflow-hidden">
        <div className="p-4 border-b border-[#22282C] flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono text-white tracking-wider">
            YEAR-OVER-YEAR (YoY) TELEMETRY LEDGER
          </h3>
          <span className="text-[11px] font-mono text-zinc-500">
            RECORD VELOCITY & PERCENTAGE DISPLACEMENTS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#090B0A] text-zinc-400 font-mono text-[10px] tracking-wider uppercase border-b border-[#22282C]">
              <tr>
                <th className="py-3 px-4">YEAR</th>
                <th className="py-3 px-4 text-right">EVENTS</th>
                <th className="py-3 px-4 text-right">Q-P1</th>
                <th className="py-3 px-4 text-right">Q-P2</th>
                <th className="py-3 px-4 text-right">Q-P3</th>
                <th className="py-3 px-4 text-right">Q-P4</th>
                <th className="py-3 px-4 text-right">TOTAL Q</th>
                <th className="py-3 px-4 text-right">Q YoY%</th>
                <th className="py-3 px-4 text-right">TOTAL S</th>
                <th className="py-3 px-4 text-right">S YoY%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1F23] font-mono text-zinc-300">
              {data.map((item) => {
                const isQPositive = item.q_growth_pct !== null && item.q_growth_pct > 0;
                const isSPositive = item.s_growth_pct !== null && item.s_growth_pct > 0;

                return (
                  <tr key={item.year} className="hover:bg-[#15191B] transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white tracking-wider">{item.year}</td>
                    <td className="py-2.5 px-4 text-right text-zinc-500">{item.record_count.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right">{item.qp1_sum.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right">{item.qp2_sum.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right">{item.qp3_sum.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right">{item.qp4_sum.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#C7FF3D]">{item.q_total_sum.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right">
                      {item.q_growth_pct !== null ? (
                        <span className={`inline-flex items-center space-x-0.5 text-[11px] ${isQPositive ? 'text-[#C7FF3D]' : 'text-rose-400'}`}>
                          <span>{isQPositive ? `+${item.q_growth_pct}%` : `${item.q_growth_pct}%`}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-[#00F0FF]">{item.s_total_sum.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right">
                      {item.s_growth_pct !== null ? (
                        <span className={`inline-flex items-center space-x-0.5 text-[11px] ${isSPositive ? 'text-[#00F0FF]' : 'text-rose-400'}`}>
                          <span>{isSPositive ? `+${item.s_growth_pct}%` : `${item.s_growth_pct}%`}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
