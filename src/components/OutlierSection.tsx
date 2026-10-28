import React, { useState, useEffect } from 'react';
import { OutliersData } from '../types';
import { api } from '../services/api';
import { Loader2, AlertOctagon, ShieldAlert, Terminal, Info, ArrowRight } from 'lucide-react';

interface OutlierSectionProps {
  onOpenConnect?: () => void;
}

export const OutlierSection: React.FC<OutlierSectionProps> = ({ onOpenConnect }) => {
  const [data, setData] = useState<OutliersData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('Q-P1');

  useEffect(() => {
    const fetchOutliers = async () => {
      setLoading(true);
      try {
        const res = await api.getOutliers(30);
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to compute outlier boundaries');
      } finally {
        setLoading(false);
      }
    };
    fetchOutliers();
  }, []);

  const defaultMetricList = ['Q-P1', 'Q-P2', 'Q-P3', 'Q-P4', 'S-P1', 'S-P2', 'S-P3', 'S-P4'];
  const metricList = data?.metrics ? Object.keys(data.metrics) : defaultMetricList;
  const activeAnalysis = data?.metrics ? (data.metrics[selectedMetric] || data.metrics['Q-P1']) : null;

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="bg-[#101314] border border-[#22282C] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono text-[#6B7780] tracking-widest uppercase mb-1">
            <span>MODULE // 06</span>
            <span>//</span>
            <span className={data ? "text-[#C7FF3D]" : "text-amber-400"}>
              {data ? "ANOMALY FENCING ENGINE" : "STANDBY CONFIGURATION"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight uppercase">
            IQR-Based Outlier Detection Telemetry
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Tukey’s non-parametric fencing framework identifying extreme business volume displacements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {!data && onOpenConnect && (
            <button
              onClick={onOpenConnect}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold text-xs font-mono shrink-0"
            >
              <span>CONNECT DATABASE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="bg-[#090B0A] px-3.5 py-2 border border-[#22282C] text-xs font-mono">
            <span className="text-zinc-500 text-[10px] block uppercase">THRESHOLD FORMULA</span>
            <span className="text-[#C7FF3D] font-semibold">[Q1 - 1.5×IQR, Q3 + 1.5×IQR]</span>
          </div>
        </div>
      </div>

      {/* Mandatory Analytical Mandate Banner */}
      <div className="bg-[#090B0A] border-l-2 border-[#C7FF3D] border-y border-r border-[#22282C] p-4 text-xs font-mono space-y-1.5">
        <div className="flex items-center space-x-2 text-[#C7FF3D] font-bold">
          <AlertOctagon className="w-4 h-4 text-[#C7FF3D] shrink-0" />
          <span className="tracking-wider uppercase">STATISTICAL INTELLIGENCE MANDATE:</span>
        </div>
        <p className="text-zinc-300 font-sans leading-relaxed text-[11px]">
          {data?.explanation || "In statistical exploratory data analysis, the Interquartile Range (IQR) method flags observations falling outside [Q1 - 1.5 × IQR, Q3 + 1.5 × IQR]. Flagged values are statistical potential outliers representing unusual business volume or operational shifts, and are NOT automatically database errors or invalid records."}
        </p>
      </div>

      {/* Channel Selector Bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#101314] p-2 border border-[#22282C]">
        <span className="text-xs font-mono text-zinc-500 px-3 uppercase tracking-wider">CHANNEL SELECTOR:</span>
        {metricList.map((m) => {
          const isSelected = selectedMetric === m;
          const info = data?.metrics?.[m];
          return (
            <button
              key={m}
              onClick={() => setSelectedMetric(m)}
              className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-mono transition border ${
                isSelected
                  ? 'bg-[#1C2125] text-white font-bold border-[#C7FF3D]'
                  : 'bg-[#090B0A] text-zinc-400 hover:text-white border-[#22282C]'
              }`}
            >
              <span>{m}</span>
              <span className={`text-[10px] px-1 py-0.2 ${info?.outlier_count && info.outlier_count > 0 ? 'bg-[#C7FF3D]/10 text-[#C7FF3D]' : 'text-zinc-600'}`}>
                {info ? `${info.outlier_pct}%` : '---'}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-3 text-xs font-mono text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-[#C7FF3D]" />
          <span>COMPUTING 1.5×IQR FENCING THRESHOLDS ACROSS 4,574 OBSERVATIONS...</span>
        </div>
      ) : (
        <>
          {/* Active Threshold Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#22282C] bg-[#101314] divide-y sm:divide-y-0 sm:divide-x divide-[#22282C]">
            <div className="p-5 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase block">
                FLAGGED OUTLIERS
              </span>
              <div className="text-3xl font-black font-mono text-[#C7FF3D] tabular-data">
                {activeAnalysis ? activeAnalysis.outlier_count.toLocaleString() : '---'}
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                {activeAnalysis ? `${activeAnalysis.outlier_pct}% of total dataset` : 'Awaiting DB evaluation'}
              </p>
            </div>

            <div className="p-5 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase block">
                LOWER FENCE BOUND
              </span>
              <div className="text-3xl font-black font-mono text-white tabular-data">
                {activeAnalysis ? activeAnalysis.lower_bound.toLocaleString() : '---'}
              </div>
              <p className="text-[11px] font-mono text-zinc-500">
                {activeAnalysis ? `Q1 (${activeAnalysis.q1}) - 1.5 × IQR` : 'Formula: Q1 - 1.5 × IQR'}
              </p>
            </div>

            <div className="p-5 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase block">
                UPPER FENCE BOUND
              </span>
              <div className="text-3xl font-black font-mono text-white tabular-data">
                {activeAnalysis ? activeAnalysis.upper_bound.toLocaleString() : '---'}
              </div>
              <p className="text-[11px] font-mono text-zinc-500">
                {activeAnalysis ? `Q3 (${activeAnalysis.q3}) + 1.5 × IQR` : 'Formula: Q3 + 1.5 × IQR'}
              </p>
            </div>

            <div className="p-5 space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase block">
                IQR INTERQUARTILE SPREAD
              </span>
              <div className="text-3xl font-black font-mono text-[#00F0FF] tabular-data">
                {activeAnalysis ? activeAnalysis.iqr.toLocaleString() : '---'}
              </div>
              <p className="text-[11px] font-mono text-zinc-500">
                {activeAnalysis ? `Q3 (${activeAnalysis.q3}) - Q1 (${activeAnalysis.q1})` : 'Middle 50% spread'}
              </p>
            </div>
          </div>

          {/* Flagged Observations Telemetry Ledger */}
          <div className="bg-[#101314] border border-[#22282C] overflow-hidden">
            <div className="p-4 border-b border-[#22282C] flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono text-white tracking-wider">
                FLAGGED OBSERVATIONS LEDGER &bull; <span className="text-[#C7FF3D]">{selectedMetric}</span>
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">
                SHOWING TOP {activeAnalysis?.potential_outliers?.length || 0} DEVIATIONS
              </span>
            </div>

            {activeAnalysis && activeAnalysis.potential_outliers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#090B0A] text-zinc-400 font-mono text-[10px] tracking-wider uppercase border-b border-[#22282C]">
                    <tr>
                      <th className="py-3 px-4">RECORD ID</th>
                      <th className="py-3 px-4">TIMESTAMP</th>
                      <th className="py-3 px-4 text-right">OBSERVED VALUE</th>
                      <th className="py-3 px-4 text-center">FENCE REGIME</th>
                      <th className="py-3 px-4 text-right">DISTANCE FROM FENCE</th>
                      <th className="py-3 px-4">DECISION ANALYSIS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1F23] font-mono text-zinc-300">
                    {activeAnalysis.potential_outliers.map((item) => {
                      const isHigh = item.type === 'high';
                      return (
                        <tr key={`${item.id}-${item.date}`} className="hover:bg-[#15191B] transition-colors">
                          <td className="py-3 px-4 text-zinc-500 font-bold">{item.id}</td>
                          <td className="py-3 px-4 text-white font-semibold">{item.date}</td>
                          <td className="py-3 px-4 text-right font-black text-[#C7FF3D]">{item.value.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase border ${
                              isHigh ? 'bg-[#C7FF3D]/10 text-[#C7FF3D] border-[#C7FF3D]/40' : 'bg-[#00F0FF]/10 text-[#00F0FF] border-[#00F0FF]/40'
                            }`}>
                              {isHigh ? 'SURGE (UPPER)' : 'DROP (LOWER)'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-zinc-300">
                            +{item.distance_from_bound.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-zinc-400 text-[11px] font-sans">
                            {isHigh ? 'Unusual transaction concentration; potential macro event.' : 'Sub-baseline volume dip; capacity anomaly.'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-xs font-mono text-zinc-500 space-y-3">
                <AlertOctagon className="w-8 h-8 mx-auto text-zinc-600" />
                <p>AWAITING DATABASE QUERY &bull; CONNECT DATABASE TO COMPUTE OBSERVATION FENCES</p>
                {onOpenConnect && (
                  <button
                    onClick={onOpenConnect}
                    className="px-3.5 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold text-xs font-mono transition"
                  >
                    CONNECT DATABASE
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
