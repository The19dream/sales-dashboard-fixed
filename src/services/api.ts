import {
  HealthResponse,
  OverviewData,
  TimeSeriesResponse,
  YearlyAggregateItem,
  ComparisonsData,
  MetricStats,
  OutliersData,
  PaginatedRecords,
  DataQualityData,
  AIInsightResponse,
} from '../types';

// In production set VITE_API_BASE_URL to the deployed FastAPI base URL, ending in /api.
// Locally, Vite proxies /api to http://127.0.0.1:8001.
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errDetail = 'Request failed';
    try {
      const data = await res.json();
      errDetail = data.detail || data.message || JSON.stringify(data);
    } catch {
      errDetail = await res.text();
    }
    throw new Error(errDetail || `HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${BASE_URL}/health`);
    return handleResponse<HealthResponse>(res);
  },

  async checkDatabase(): Promise<{ status: string; message: string; details: any }> {
    const res = await fetch(`${BASE_URL}/health/db`);
    return handleResponse<{ status: string; message: string; details: any }>(res);
  },

  async testConnection(databaseUrl: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/config/test-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ database_url: databaseUrl }),
    });
    return handleResponse(res);
  },

  async saveConnection(databaseUrl: string): Promise<any> {
    const res = await fetch(`${BASE_URL}/config/save-connection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ database_url: databaseUrl }),
    });
    return handleResponse(res);
  },

  async getOverview(): Promise<OverviewData> {
    const res = await fetch(`${BASE_URL}/analytics/overview`);
    return handleResponse<OverviewData>(res);
  },

  async getTimeSeries(params: {
    frequency?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TimeSeriesResponse> {
    const query = new URLSearchParams();
    if (params.frequency) query.set('frequency', params.frequency);
    if (params.startDate) query.set('start_date', params.startDate);
    if (params.endDate) query.set('end_date', params.endDate);
    const res = await fetch(`${BASE_URL}/analytics/time-series?${query.toString()}`);
    return handleResponse<TimeSeriesResponse>(res);
  },

  async getYearly(): Promise<YearlyAggregateItem[]> {
    const res = await fetch(`${BASE_URL}/analytics/yearly`);
    return handleResponse<YearlyAggregateItem[]>(res);
  },

  async getComparisons(): Promise<ComparisonsData> {
    const res = await fetch(`${BASE_URL}/analytics/comparisons`);
    return handleResponse<ComparisonsData>(res);
  },

  async getStatistics(): Promise<Record<string, MetricStats>> {
    const res = await fetch(`${BASE_URL}/analytics/statistics`);
    return handleResponse<Record<string, MetricStats>>(res);
  },

  async getOutliers(sampleLimit: number = 25): Promise<OutliersData> {
    const res = await fetch(`${BASE_URL}/analytics/outliers?sample_limit=${sampleLimit}`);
    return handleResponse<OutliersData>(res);
  },

  async getRecords(params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<PaginatedRecords> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page.toString());
    if (params.pageSize) query.set('page_size', params.pageSize.toString());
    if (params.sortBy) query.set('sort_by', params.sortBy);
    if (params.sortDir) query.set('sort_dir', params.sortDir);
    if (params.startDate) query.set('start_date', params.startDate);
    if (params.endDate) query.set('end_date', params.endDate);
    if (params.search) query.set('search', params.search);
    const res = await fetch(`${BASE_URL}/analytics/records?${query.toString()}`);
    return handleResponse<PaginatedRecords>(res);
  },

  getExportUrl(params: { startDate?: string; endDate?: string; search?: string }): string {
    const query = new URLSearchParams();
    if (params.startDate) query.set('start_date', params.startDate);
    if (params.endDate) query.set('end_date', params.endDate);
    if (params.search) query.set('search', params.search);
    return `${BASE_URL}/analytics/export?${query.toString()}`;
  },

  async getDataQuality(): Promise<DataQualityData> {
    const res = await fetch(`${BASE_URL}/analytics/data-quality`);
    return handleResponse<DataQualityData>(res);
  },

  async getAIInsight(context: string, userPrompt?: string): Promise<AIInsightResponse> {
    const res = await fetch(`${BASE_URL}/ai/insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context, user_prompt: userPrompt }),
    });
    return handleResponse<AIInsightResponse>(res);
  },
};
