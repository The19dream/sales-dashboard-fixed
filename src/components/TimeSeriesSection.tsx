import React, { useState, useEffect } from 'react';
import { TimeSeriesResponse, TimeSeriesPoint } from '../types';
import { api } from '../services/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import { Filter, Loader2, ArrowRight, Activity, Calendar } from 'lucide-react';

// Precision neo-industrial palette
const METRIC_PALETTE: Record<string, { stroke: string; label: string; group: 'Q' | 'S' }> = {
  'Q-P1': { stroke: '#C7FF3D', label: 'Q-P1', group: 'Q' }, // Acid Lime
  'Q-P2': { stroke: '#9EE02A', label: 'Q-P2', group: 'Q' },
  'Q-P3': { stroke: '#00F0FF', label: 'Q-P3', group: 'Q' }, // Electric Cyan
  'Q-P4': { stroke: '#00B8D9', label: 'Q-P4', group: 'Q' },
  'S-P1': { stroke: '#FF5C8D', label: 'S-P1', group: 'S' }, // Neon Coral
  'S-P2': { stroke: '#FF944D', label: 'S-P2', group: 'S' }, // Amber
  'S-P3': { stroke: '#B388FF', label: 'S-P3', group: 'S' }, // Violet
  'S-P4': { stroke: '#7C4DFF', label: 'S-P4', group: 'S' },
  q_total: { stroke: '#C7FF3D', label: 'TOTAL Q', group: 'Q' },
  s_total: { stroke: '#FF5C8D', label: 'TOTAL S', group: 'S' },
};

interface TimeSeriesSectionProps {
  onOpenConnect?: () => void;
}

export const TimeSeriesSection: React.FC<TimeSeriesSectionProps> = ({ onOpenConnect }) => {
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'daily' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState<string>('2010-06-13');
  const [endDate, setEndDate] = useState<string>('2023-02-03');
  const [data, setData] = useState<TimeSeriesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [renderMode, setRenderMode] = useState<'line' | 'area'>('line');
  const [groupFilter, setGroupFilter] = useState<'ALL' | 'Q_ONLY' | 'S_ONLY'>('ALL');

  const [visibleMetrics, setVisibleMetrics] = useState<Record<string, boolean>>({
    'Q-P1': true,
    'Q-P2': true,
    'Q-P3': true,
    'Q-P4': true,
    'S-P1': true,
    'S-P2': true,
    'S-P3': true,
    'S-P4': true,
    q_total: false,
    s_total: false,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTimeSeries({
        frequency,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to compute time series stream');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [frequency]);

  const handleApplyPreset = (preset: 'ALL' | '5Y' | '3Y' | '1Y') => {
    if (preset === 'ALL') {
      setStartDate('2010-06-13');
      setEndDate('2023-02-03');
    } else if (preset === '5Y') {
      setStartDate('2018-01-01');
      setEndDate('2023-02-03');
    } else if (preset === '3Y') {
      setStartDate('2020-01-01');
      setEndDate('2023-02-03');
    } else if (preset === '1Y') {
      setStartDate('2022-01-01');
      setEndDate('2023-02-03');
    }
  };

  const toggleMetric = (key: string) => {
    setVisibleMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isMetricActive = (key: string) => {
    if (!visibleMetrics[key]) return false;
    if (groupFilter === 'Q_ONLY' && key.startsWith('S-')) return false;
    if (groupFilter === 'S_ONLY' && key.startsWith('Q-')) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      {/* Studio Header & Technical Control Grid */}
      <div className="bg-[#101314] border border-[#22282C] p-6 space-y-5">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-[#22282C] pb-5">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#6B7780] tracking-widest uppercase mb-1">
              <span>MODULE // 02</span>
              <span>//</span>
              <span className="text-[#C7FF3D]">TEMPORAL ANALYTICS ENGINE</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-tight uppercase">
              Time-Series Intelligence Center
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Dynamic multi-frequency historical trajectory of Q and S operational vectors.
            </p>
          </div>

          {/* Temporal Frequency Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex border border-[#2B3338] bg-[#090B0A] p-0.5">
              {(
                [
                  { id: 'daily', label: '1D // DAILY' },
                  { id: 'weekly', label: '1W // WEEKLY' },
                  { id: 'monthly', label: '1M // MONTHLY' },
                  { id: 'yearly', label: '1Y // YEARLY' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFrequency(f.id)}
                  className={`px-3 py-1.5 text-xs font-mono transition ${
                    frequency === f.id
                      ? 'bg-[#C7FF3D] text-[#090B0A] font-bold shadow-[0_0_8px_rgba(199,255,61,0.25)]'
                      : 'text-zinc-400 hover:text-white hover:bg-[#161A1C]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex border border-[#2B3338] bg-[#090B0A] p-0.5 text-xs font-mono">
              <button
                onClick={() => setRenderMode('line')}
                className={`px-3 py-1.5 transition ${
                  renderMode === 'line'
                    ? 'bg-[#1C2125] text-white font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                LINE
              </button>
              <button
                onClick={() => setRenderMode('area')}
                className={`px-3 py-1.5 transition ${
                  renderMode === 'area'
                    ? 'bg-[#1C2125] text-white font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                AREA
              </button>
            </div>
          </div>
        </div>

        {/* Date Window Controls & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5 bg-[#090B0A] px-2.5 py-1.5 border border-[#22282C]">
              <span className="text-zinc-500 text-[10px]">RANGE:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-white text-xs font-mono focus:outline-none"
              />
              <span className="text-zinc-600">&rarr;</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-white text-xs font-mono focus:outline-none"
              />
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-1.5 bg-[#161A1C] hover:bg-[#20262A] text-white border border-[#2B3338] hover:border-[#C7FF3D] transition flex items-center space-x-1.5"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C7FF3D]" /> : <Filter className="w-3.5 h-3.5 text-[#C7FF3D]" />}
              <span>EXECUTE QUERY</span>
            </button>

            {/* Quick Presets */}
            <div className="flex items-center space-x-1 text-[11px] text-zinc-500">
              <span className="mr-1">PRESETS:</span>
              {(['ALL', '5Y', '3Y', '1Y'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    handleApplyPreset(p);
                    setTimeout(fetchData, 50);
                  }}
                  className="px-2 py-1 bg-[#090B0A] hover:bg-[#161A1C] text-zinc-300 hover:text-[#C7FF3D] border border-[#22282C] transition"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Dimension Filter Switch */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-zinc-500 text-[10px] tracking-wider uppercase">DIMENSION FOCUS:</span>
            <div className="flex border border-[#22282C] bg-[#090B0A] p-0.5">
              {(
                [
                  { id: 'ALL', label: 'COMBINED' },
                  { id: 'Q_ONLY', label: 'Q ONLY' },
                  { id: 'S_ONLY', label: 'S ONLY' },
                ] as const
              ).map((gf) => (
                <button
                  key={gf.id}
                  onClick={() => setGroupFilter(gf.id)}
                  className={`px-2.5 py-1 text-[11px] font-mono transition ${
                    groupFilter === gf.id ? 'bg-[#1C2125] text-[#C7FF3D] font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {gf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Selector Toggles */}
        <div className="pt-3 border-t border-[#1C2125] flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase mr-1">ACTIVE CHANNELS:</span>
          {Object.keys(METRIC_PALETTE).map((metricKey) => {
            if (groupFilter === 'Q_ONLY' && metricKey.startsWith('S-')) return null;
            if (groupFilter === 'S_ONLY' && metricKey.startsWith('Q-')) return null;

            const isToggled = visibleMetrics[metricKey];
            const meta = METRIC_PALETTE[metricKey];

            return (
              <button
                key={metricKey}
                onClick={() => toggleMetric(metricKey)}
                className={`px-2.5 py-1 text-xs font-mono transition flex items-center space-x-2 border ${
                  isToggled
                    ? 'bg-[#090B0A] text-white border-[#2B3338]'
                    : 'bg-[#090B0A]/40 text-zinc-600 border-[#1A1F22] opacity-40'
                }`}
              >
                <span className="w-2 h-2 rounded-none inline-block" style={{ backgroundColor: meta.stroke }} />
                <span>{metricKey}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Centerpiece Visualization Canvas */}
      <div className="bg-[#101314] border border-[#22282C] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#22282C] pb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#C7FF3D]" />
            <h3 className="text-sm font-bold font-mono text-white tracking-wide">
              HISTORICAL TELEMETRY MATRIX &bull; {data?.points_count || 0} POINTS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            AGGREGATION WINDOW: <span className="text-zinc-300 uppercase">{frequency}</span>
          </span>
        </div>

        {loading ? (
          <div className="h-[420px] flex flex-col items-center justify-center space-y-3 text-xs font-mono text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#C7FF3D]" />
            <span>EXECUTING SQL TEMPORAL TRUNCATION QUERY...</span>
          </div>
        ) : error ? (
          <div className="h-[420px] flex flex-col items-center justify-center p-8 space-y-4 text-center border border-dashed border-[#22282C]">
            <div className="w-10 h-10 bg-[#FF5C8D]/10 border border-[#FF5C8D]/40 text-[#FF5C8D] font-mono font-bold flex items-center justify-center">
              !
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Awaiting Database Connection
              </div>
              <p className="text-xs text-zinc-400 font-sans max-w-md">
                Connect your Supabase PostgreSQL database to stream 4,574 historical records and execute SQL temporal aggregations across Q and S metrics.
              </p>
            </div>
            {onOpenConnect && (
              <button
                onClick={onOpenConnect}
                className="px-4 py-2 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold text-xs font-mono transition shadow-[0_0_12px_rgba(199,255,61,0.25)]"
              >
                CONNECT DATABASE
              </button>
            )}
          </div>
        ) : data && data.data.length > 0 ? (
          <div className="h-[440px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {renderMode === 'line' ? (
                <LineChart data={data.data} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="1 3" stroke="#1A1F23" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#4A5560"
                    tick={{ fill: '#8E9A9E', fontSize: 10, fontFamily: 'monospace' }}
                    angle={-30}
                    textAnchor="end"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#4A5560"
                    tick={{ fill: '#8E9A9E', fontSize: 10, fontFamily: 'monospace' }}
                    tickFormatter={(val) => val.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090B0A',
                      borderColor: '#22282C',
                      borderRadius: '0px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.9)',
                    }}
                    formatter={(val: any, name: any) => [Number(val).toLocaleString(), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '15px' }} />
                  {Object.keys(METRIC_PALETTE).map((key) => {
                    if (!isMetricActive(key)) return null;
                    return (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={METRIC_PALETTE[key].stroke}
                        dot={false}
                        strokeWidth={1.75}
                        activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 1.5 }}
                      />
                    );
                  })}
                </LineChart>
              ) : (
                <AreaChart data={data.data} margin={{ top: 15, right: 30, left: 10, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="1 3" stroke="#1A1F23" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#4A5560"
                    tick={{ fill: '#8E9A9E', fontSize: 10, fontFamily: 'monospace' }}
                    angle={-30}
                    textAnchor="end"
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    stroke="#4A5560"
                    tick={{ fill: '#8E9A9E', fontSize: 10, fontFamily: 'monospace' }}
                    tickFormatter={(val) => val.toLocaleString()}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#090B0A',
                      borderColor: '#22282C',
                      borderRadius: '0px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                    }}
                    formatter={(val: any, name: any) => [Number(val).toLocaleString(), name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '15px' }} />
                  {Object.keys(METRIC_PALETTE).map((key) => {
                    if (!isMetricActive(key)) return null;
                    return (
                      <Area
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={METRIC_PALETTE[key].stroke}
                        fill={METRIC_PALETTE[key].stroke}
                        fillOpacity={0.12}
                        strokeWidth={1.5}
                      />
                    );
                  })}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[420px] flex items-center justify-center text-xs font-mono text-zinc-500">
            NO EMPIRICAL OBSERVATIONS MATCH THE CURRENT TEMPORAL SPECIFICATION.
          </div>
        )}
      </div>
    </div>
  );
};
