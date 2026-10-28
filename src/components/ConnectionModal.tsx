import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Database, Shield, ExternalLink, Loader2, ArrowRight, Terminal } from 'lucide-react';
import { DatabaseHealth } from '../types';
import { api } from '../services/api';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: DatabaseHealth | null;
  onSuccess: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  health,
  onSuccess,
}) => {
  const [dbUrl, setDbUrl] = useState('');
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!dbUrl.trim()) {
      setErrorMsg('Please specify a valid PostgreSQL connection URI.');
      return;
    }
    setTesting(true);
    setErrorMsg(null);
    setTestResult(null);
    try {
      const res = await api.testConnection(dbUrl.trim());
      setTestResult(res);
      if (!res.connected) {
        setErrorMsg(res.error || 'Connection failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection test failed.');
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!dbUrl.trim()) {
      setErrorMsg('Please specify a valid PostgreSQL connection URI.');
      return;
    }
    setSaving(true);
    setErrorMsg(null);
    try {
      await api.saveConnection(dbUrl.trim());
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save connection.');
    } finally {
      setSaving(false);
    }
  };

  const isCurrentConnected = Boolean(health?.connected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090B0A]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#101314] border border-[#2B3338] rounded-none max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22282C] bg-[#0D0F10]">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-[#C7FF3D] text-[#090B0A] font-mono font-bold text-xs flex items-center justify-center">
              DB
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold font-mono tracking-wider text-white uppercase">
                  POSTGRESQL // CONNECTION HANDSHAKE
                </h2>
                <span className="text-[9px] font-mono bg-[#161A1C] text-[#C7FF3D] px-1 py-0.2 border border-[#22282C]">
                  PORT 6543 / 5432
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">
                Secure server-side database configuration for public.sales_data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 hover:bg-[#161A1C] transition font-mono"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-mono">
          {/* Status Diagnostic Card */}
          <div className={`p-4 border ${
            isCurrentConnected
              ? 'bg-[#090B0A] border-[#C7FF3D]/40 text-zinc-300'
              : 'bg-[#090B0A] border-[#22282C] text-zinc-400'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 font-bold">
                <span className={`w-2 h-2 ${isCurrentConnected ? 'bg-[#C7FF3D]' : 'bg-rose-500'} inline-block`} />
                <span className="tracking-wider uppercase">
                  {isCurrentConnected ? 'STATUS: ACTIVE CONNECTION' : 'STATUS: DISCONNECTED'}
                </span>
              </div>
              {health?.latency_ms !== null && (
                <span className="text-[10px] text-zinc-400">LATENCY: {health?.latency_ms}ms</span>
              )}
            </div>

            {isCurrentConnected ? (
              <div className="space-y-1 text-xs text-zinc-300 pt-1 border-t border-[#1C2125]">
                <div>TABLE: <span className="text-[#C7FF3D] font-bold">public.sales_data</span></div>
                <div>RECORDS: <span className="text-white font-bold">{health?.record_count?.toLocaleString()}</span> (TARGET: 4,574)</div>
                {health?.date_range && (
                  <div>RANGE: <span className="text-white">{health.date_range.min_date}</span> &rarr; <span className="text-white">{health.date_range.max_date}</span></div>
                )}
                <div className="text-[10px] text-zinc-500 pt-1">
                  COLUMNS VERIFIED: {health?.columns_present?.join(', ')}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-400">
                {health?.error || 'No active connection string configured. Enter your Supabase URI below or configure DATABASE_URL in .env.'}
              </p>
            )}
          </div>

          {/* Connection URI Input */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-zinc-300 tracking-wider uppercase">
              SUPABASE POSTGRESQL CONNECTION URI:
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require"
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                className="w-full bg-[#090B0A] border border-[#2B3338] px-3 py-2 text-xs font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-[#C7FF3D]"
              />
            </div>
            <p className="text-[10px] text-zinc-500 flex items-center space-x-1.5 pt-1">
              <Shield className="w-3.5 h-3.5 text-[#C7FF3D] shrink-0" />
              <span>Credentials stay strictly on the server and are never exposed to browser client-side code.</span>
            </p>
          </div>

          {/* Instructions Box */}
          <div className="bg-[#090B0A] p-4 border border-[#22282C] text-[11px] text-zinc-400 space-y-2">
            <div className="font-bold text-zinc-300 tracking-wider uppercase">
              RETRIEVAL INSTRUCTIONS FROM SUPABASE DASHBOARD:
            </div>
            <ol className="list-decimal list-inside space-y-1 font-sans text-xs">
              <li>Open your project at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-[#C7FF3D] hover:underline inline-flex items-center">Supabase Dashboard <ExternalLink className="w-3 h-3 ml-0.5" /></a></li>
              <li>Go to <strong className="text-white font-mono">Project Settings</strong> &rarr; <strong className="text-white font-mono">Database</strong></li>
              <li>Under <strong className="text-white font-mono">Connection string</strong>, select the <strong className="text-white font-mono">URI</strong> tab</li>
              <li>Choose <strong className="text-white font-mono">Transaction pooler</strong> (port 6543) or <strong className="text-white font-mono">Direct</strong> (port 5432)</li>
              <li>Replace <code className="text-[#C7FF3D] font-mono">[YOUR-PASSWORD]</code> with your actual database password</li>
            </ol>
          </div>

          {/* Test Feedback */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-900 text-rose-300 text-xs">
              <div className="font-bold mb-1 flex items-center space-x-1.5 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>HANDSHAKE FAILURE:</span>
              </div>
              <div className="break-all font-mono text-[11px]">{errorMsg}</div>
            </div>
          )}

          {testResult && testResult.connected && (
            <div className="p-3 bg-[#090B0A] border border-[#C7FF3D] text-[#C7FF3D] text-xs space-y-1">
              <div className="font-bold flex items-center space-x-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CONNECTION VERIFICATION SUCCESSFUL</span>
              </div>
              <div>TABLE: public.sales_data ({testResult.record_count?.toLocaleString()} ROWS)</div>
              <div>TARGET MATCH (4,574): {testResult.is_exact_count_match ? 'EXACT MATCH' : 'VARIANCE'}</div>
              <div>LATENCY: {testResult.latency_ms}ms</div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#22282C] bg-[#0D0F10]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white bg-[#101314] hover:bg-[#161A1C] border border-[#22282C] transition"
          >
            DISMISS
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleTest}
              disabled={testing || saving || !dbUrl.trim()}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-mono text-white bg-[#161A1C] hover:bg-[#20262A] border border-[#2B3338] hover:border-[#C7FF3D] transition disabled:opacity-40"
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C7FF3D]" /> : null}
              <span>TEST HANDSHAKE</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving || testing || !dbUrl.trim()}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-mono font-bold text-[#090B0A] bg-[#C7FF3D] hover:bg-[#B5F525] transition shadow-[0_0_10px_rgba(199,255,61,0.25)] disabled:opacity-40"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              <span>SAVE & CONNECT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
