/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { DatabaseHealth, OverviewData } from './types';
import { NavigationRail } from './components/NavigationRail';
import { TopBar } from './components/TopBar';
import { ConnectionModal } from './components/ConnectionModal';
import { OverviewSection } from './components/OverviewSection';
import { TimeSeriesSection } from './components/TimeSeriesSection';
import { YearlySection } from './components/YearlySection';
import { ComparisonSection } from './components/ComparisonSection';
import { StatisticsSection } from './components/StatisticsSection';
import { OutlierSection } from './components/OutlierSection';
import { DataTableSection } from './components/DataTableSection';
import { DataQualitySection } from './components/DataQualitySection';
import { AIInsightsModal } from './components/AIInsightsModal';
import { Loader2, AlertOctagon, ArrowRight } from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState<DatabaseHealth | null>(null);
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);

  const checkHealthAndLoadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

    try {
      const healthRes = await api.getHealth();
      setHealth(healthRes.database);

      if (healthRes.database.connected) {
        const overviewRes = await api.getOverview();
        setOverview(overviewRes);
      } else {
        setOverview(null);
      }
    } catch (err: any) {
      console.error('API / Health error:', err);
      setHealth({
        connected: false,
        configured: false,
        record_count: null,
        expected_count: 4574,
        is_exact_count_match: false,
        date_range: null,
        columns_present: [],
        latency_ms: null,
        error: err.message || 'Cannot communicate with FastAPI backend server.',
      });
      setOverview(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    checkHealthAndLoadData();
  }, [checkHealthAndLoadData]);

  const isConnected = Boolean(health?.connected);

  return (
    <div className="min-h-screen bg-[#090B0A] text-[#E2E8F0] flex flex-col lg:flex-row font-sans selection:bg-[#C7FF3D] selection:text-[#090B0A] nexus-grid-bg">
      {/* Neo-Industrial Navigation Rail */}
      <NavigationRail
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        onRefresh={() => checkHealthAndLoadData(true)}
        onOpenConnect={() => setIsConnectModalOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Analytical Workstation Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          health={health}
          onOpenConnect={() => setIsConnectModalOpen(true)}
          onOpenAI={() => setIsAIModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3 text-zinc-500 font-mono text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-[#C7FF3D]" />
              <span className="tracking-widest uppercase">INITIALIZING TELEMETRY STREAM & HANDSHAKE...</span>
            </div>
          ) : (
            <div className="animate-in fade-in duration-150 space-y-6">
              {/* Standby Banner if database is not yet connected */}
              {!isConnected && (
                <div className="bg-[#101314] border-l-2 border-[#FF5C8D] border-y border-r border-[#22282C] p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center space-x-2.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-[#FF5C8D] shrink-0" />
                    <div>
                      <span className="text-[#FF5C8D] font-bold tracking-wider">DATABASE STANDBY: </span>
                      <span className="text-zinc-400">Target table public.sales_data (4,574 records). Connect Supabase URI to execute live SQL queries.</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsConnectModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold text-xs font-mono transition shrink-0 shadow-[0_0_8px_rgba(199,255,61,0.2)]"
                  >
                    <span>CONNECT NOW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {activeTab === 'overview' && (
                <OverviewSection
                  data={overview}
                  onOpenAI={() => setIsAIModalOpen(true)}
                  onOpenConnect={() => setIsConnectModalOpen(true)}
                />
              )}
              {activeTab === 'timeseries' && (
                <TimeSeriesSection onOpenConnect={() => setIsConnectModalOpen(true)} />
              )}
              {activeTab === 'yearly' && (
                <YearlySection onOpenConnect={() => setIsConnectModalOpen(true)} />
              )}
              {activeTab === 'comparisons' && (
                <ComparisonSection onOpenConnect={() => setIsConnectModalOpen(true)} />
              )}
              {activeTab === 'statistics' && (
                <StatisticsSection onOpenConnect={() => setIsConnectModalOpen(true)} />
              )}
              {activeTab === 'outliers' && (
                <OutlierSection onOpenConnect={() => setIsConnectModalOpen(true)} />
              )}
              {activeTab === 'explorer' && (
                <DataTableSection onOpenConnect={() => setIsConnectModalOpen(true)} />
              )}
              {activeTab === 'quality' && (
                <DataQualitySection onOpenConnect={() => setIsConnectModalOpen(true)} />
              )}
            </div>
          )}
        </main>

        {/* Minimal Terminal Footer */}
        <footer className="border-t border-[#22282C] bg-[#090B0A] px-6 py-3 text-[10px] font-mono text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[#C7FF3D] font-bold">NEXUS // FODS</span>
            <span>&bull;</span>
            <span>FOUNDATION OF DATA SCIENCE INTELLIGENCE LAB</span>
          </div>
          <div className="flex items-center space-x-3 text-zinc-500">
            <span>FASTAPI: PORT 8001</span>
            <span>&bull;</span>
            <span>TABLE: PUBLIC.SALES_DATA</span>
            <span>&bull;</span>
            <span>VERIFIED: 4,574 OBSERVATIONS</span>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <ConnectionModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        health={health}
        onSuccess={() => checkHealthAndLoadData(true)}
      />

      <AIInsightsModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        activeContext={activeTab}
      />
    </div>
  );
}
