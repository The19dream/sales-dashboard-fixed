import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, Bot, Database, Copy, Check, Terminal, Cpu } from 'lucide-react';
import { api } from '../services/api';
import { AIInsightResponse } from '../types';

interface AIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext?: string;
}

export const AIInsightsModal: React.FC<AIInsightsModalProps> = ({
  isOpen,
  onClose,
  activeContext = 'overview',
}) => {
  const [context, setContext] = useState<string>(activeContext);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [insight, setInsight] = useState<AIInsightResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (ctxToUse = context) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAIInsight(ctxToUse, prompt.trim() || undefined);
      setInsight(res);
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI synthesis');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (insight?.insight) {
      navigator.clipboard.writeText(insight.insight);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090B0A]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#101314] border border-[#2B3338] rounded-none max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22282C] bg-[#0D0F10]">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-[#00F0FF] text-[#090B0A] font-mono font-bold text-xs flex items-center justify-center shadow-[0_0_8px_rgba(0,240,255,0.3)]">
              AI
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold font-mono tracking-wider text-white uppercase">
                  NEXUS // GEMINI DECISION SYNTHESIS
                </h2>
                <span className="text-[9px] font-mono bg-[#161A1C] text-[#00F0FF] px-1 py-0.2 border border-[#22282C]">
                  GROUND TRUTH ENGINE
                </span>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tight">
                Grounded exclusively on calculated PostgreSQL metrics
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono">
          {/* Context Selector Bar */}
          <div className="flex flex-wrap items-center gap-1.5 border border-[#22282C] bg-[#090B0A] p-1.5">
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider px-2">FOCUS DOMAIN:</span>
            {(
              [
                { id: 'overview', label: '01 // OVERVIEW' },
                { id: 'yearly', label: '02 // YEARLY' },
                { id: 'statistics', label: '03 // STATS' },
                { id: 'comparisons', label: '04 // MATRIX' },
                { id: 'outliers', label: '05 // OUTLIERS' },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setContext(c.id);
                  handleGenerate(c.id);
                }}
                className={`px-3 py-1 transition ${
                  context === c.id
                    ? 'bg-[#C7FF3D] text-[#090B0A] font-bold shadow-[0_0_8px_rgba(199,255,61,0.25)]'
                    : 'text-zinc-400 hover:text-white hover:bg-[#161A1C]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* User Prompt Input */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 font-mono text-[#00F0FF] text-xs">&gt;</span>
              <input
                type="text"
                placeholder="PROMPT EXECUTIVE INTELLIGENCE (E.G. 'IDENTIFY CORE RISKS FROM DISPERSION SKIES')..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                className="w-full bg-[#090B0A] border border-[#2B3338] pl-7 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#00F0FF] font-mono tracking-wider"
              />
            </div>
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="flex items-center space-x-1.5 px-4 py-2 bg-[#00F0FF] hover:bg-[#2CE8F5] text-[#090B0A] font-bold transition shadow-[0_0_10px_rgba(0,240,255,0.2)] disabled:opacity-40"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>SYNTHESIZE</span>
            </button>
          </div>

          {/* Error Feedback */}
          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-900 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Synthesis Result */}
          {insight ? (
            <div className="bg-[#090B0A] border border-[#22282C] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1C2125] pb-2.5">
                <div className="flex items-center space-x-2 text-zinc-400 text-[10px]">
                  <Cpu className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>SYNTHESIS MODEL: <strong className="text-white font-mono">{insight.model}</strong></span>
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 text-zinc-400 hover:text-white text-[10px] px-2 py-1 bg-[#161A1C] border border-[#22282C] transition"
                >
                  {copied ? <Check className="w-3 h-3 text-[#C7FF3D]" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'COPIED' : 'COPY LEDGER'}</span>
                </button>
              </div>

              <div className="text-zinc-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {insight.insight}
              </div>
            </div>
          ) : !loading && (
            <div className="p-12 text-center text-zinc-600 space-y-2 border border-dashed border-[#22282C]">
              <Terminal className="w-8 h-8 mx-auto text-zinc-700" />
              <p className="font-mono text-xs">AWAITING SYSTEM SYNTHESIS DIRECTIVE. SELECT A FOCUS DOMAIN ABOVE.</p>
            </div>
          )}

          {loading && (
            <div className="p-12 flex flex-col items-center justify-center space-y-3 text-zinc-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#00F0FF]" />
              <span className="font-mono text-xs">GROUNDING STRICTLY IN POSTGRESQL STATISTICAL DISTRIBUTIONS...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#22282C] bg-[#0D0F10] flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-[#C7FF3D] inline-block" />
            <span>GROUND TRUTH MANDATE: 100% FACTUAL DERIVATION, ZERO HALLUCINATION</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#161A1C] hover:bg-[#20262A] text-zinc-300 hover:text-white border border-[#22282C] transition"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
