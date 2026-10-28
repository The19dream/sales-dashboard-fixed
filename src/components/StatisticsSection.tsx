import React, { useState, useEffect } from 'react';
import { MetricStats } from '../types';
import { api } from '../services/api';
import { Loader2, Calculator, Info, ShieldCheck, Binary, ArrowRight } from 'lucide-react';

interface StatisticsSectionProps {
  onOpenConnect?: () => void;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({ onOpenConnect }) => {
  const [stats, setStats] = useState<Record<string, MetricStats> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.getStatistics();
        setStats(res);
      } catch (err: any) {
        setError(err.message || 'Failed to compute descriptive statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const metricKeys = ['Q-P1', 'Q-P2', 'Q-P3', 'Q-P4', 'S-P1', 'S-P2', 'S-P3', 'S-P4'];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#101314] border border-[#22282C] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#6B7780] tracking-widest uppercase mb-1">
            <span>MODULE // 05</span>
            <span>//</span>
            <span className={stats ? "text-[#C7FF3D]" : "text-amber-400"}>
              {stats ? "EMPIRICAL DISTRIBUTIONS" : "STANDBY CONFIGURATION"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight uppercase">
            Descriptive Statistics Workstation
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Parametric central tendencies (Mean, Std Dev) and robust non-parametric quantiles (Median, IQR).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {!stats && onOpenConnect && (
            <button
              onClick={onOpenConnect}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold text-xs font-mono shrink-0"
            >
              <span>CONNECT DATABASE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="bg-[#090B0A] px-3.5 py-2 border border-[#22282C] text-xs font-mono">
            <span className="text-zinc-500 text-[10px] block uppercase">EXACT PERCENTILES</span>
            <span className="text-[#C7FF3D] font-semibold">PERCENTILE_CONT(0.5)</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-3 text-xs font-mono text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-[#C7FF3D]" />
          <span>COMPUTING EXACT PARAMETRIC & NON-PARAMETRIC DISTRIBUTIONS IN POSTGRESQL...</span>
        </div>
      ) : (
        <>
          {/* Main Scientific Ledger Matrix */}
          <div className="bg-[#101314] border border-[#22282C] overflow-hidden">
            <div className="p-4 border-b border-[#22282C] flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono text-white tracking-wider flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-[#C7FF3D]" />
                <span>PRIMARY PARAMETRIC & NON-PARAMETRIC MATRIX</span>
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">
                N = 4,574 OBSERVATIONS &bull; 8 VECTOR CHANNELS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#090B0A] text-zinc-400 font-mono text-[10px] tracking-wider uppercase border-b border-[#22282C]">
                  <tr>
                    <th className="py-3 px-4">CHANNEL</th>
                    <th className="py-3 px-4 text-right">COUNT</th>
                    <th className="py-3 px-4 text-right">MIN</th>
                    <th className="py-3 px-4 text-right">MAX</th>
                    <th className="py-3 px-4 text-right text-zinc-200">MEAN (μ)</th>
                    <th className="py-3 px-4 text-right text-[#C7FF3D]">MEDIAN (Q2)</th>
                    <th className="py-3 px-4 text-right">STD DEV (σ)</th>
                    <th className="py-3 px-4 text-right">VARIANCE (σ²)</th>
                    <th className="py-3 px-4 text-right">Q1 (25%)</th>
                    <th className="py-3 px-4 text-right">Q3 (75%)</th>
                    <th className="py-3 px-4 text-right text-[#00F0FF]">IQR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1F23] font-mono text-zinc-300">
                  {metricKeys.map((k) => {
                    const item = stats ? stats[k] : null;
                    const isQ = k.startsWith('Q-');

                    return (
                      <tr key={k} className="hover:bg-[#15191B] transition-colors">
                        <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                          <span className={`w-2 h-2 ${isQ ? 'bg-[#C7FF3D]' : 'bg-[#00F0FF]'}`} />
                          <span>{k}</span>
                        </td>
                        <td className="py-3 px-4 text-right text-zinc-500">{item ? item.count.toLocaleString() : '4,574'}</td>
                        <td className="py-3 px-4 text-right">{item ? item.min.toLocaleString() : '---'}</td>
                        <td className="py-3 px-4 text-right">{item ? item.max.toLocaleString() : '---'}</td>
                        <td className="py-3 px-4 text-right font-semibold text-white">{item ? item.mean.toLocaleString() : '---'}</td>
                        <td className="py-3 px-4 text-right font-black text-[#C7FF3D]">{item ? item.median.toLocaleString() : '---'}</td>
                        <td className="py-3 px-4 text-right">{item ? item.stddev.toLocaleString() : '---'}</td>
                        <td className="py-3 px-4 text-right text-zinc-500">{item ? item.variance.toLocaleString() : '---'}</td>
                        <td className="py-3 px-4 text-right">{item ? item.q1.toLocaleString() : '---'}</td>
                        <td className="py-3 px-4 text-right">{item ? item.q3.toLocaleString() : '---'}</td>
                        <td className="py-3 px-4 text-right font-bold text-[#00F0FF]">{item ? item.iqr.toLocaleString() : '---'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytical Interpretations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#101314] border border-[#22282C] p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-[#C7FF3D] tracking-wider uppercase">PRINCIPLE 01</span>
                <span className="text-zinc-600">//</span>
                <h3 className="text-sm font-bold font-mono text-white">Mean vs. Median Skewness Dynamics</h3>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Comparing the parametric <strong className="text-white font-mono">Mean (μ)</strong> against the non-parametric <strong className="text-[#C7FF3D] font-mono">Median (Q2)</strong> exposes structural tail heaviness in transactional volumes. When Mean exceeds Median, high-volume transactional surges bias the parametric center, making the Median a superior baseline for decision intelligence.
              </p>
            </div>

            <div className="bg-[#101314] border border-[#22282C] p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono text-[#00F0FF] tracking-wider uppercase">PRINCIPLE 02</span>
                <span className="text-zinc-600">//</span>
                <h3 className="text-sm font-bold font-mono text-white">Dispersion & Quartile Foundation</h3>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                The <strong className="text-[#00F0FF] font-mono">Interquartile Range (IQR = Q3 - Q1)</strong> represents the core 50% operational bandwidth. Unlike Standard Deviation (σ), the IQR is invariant to extreme anomalous spikes, providing an uncorrupted dispersion metric for enterprise inventory planning.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
