export interface DatabaseHealth {
  connected: boolean;
  configured: boolean;
  record_count: number | null;
  expected_count: number;
  is_exact_count_match: boolean;
  date_range: {
    min_date: string | null;
    max_date: string | null;
  } | null;
  columns_present: string[];
  latency_ms: number | null;
  error: string | null;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  database: DatabaseHealth;
}

export interface MetricSummary {
  metric: string;
  total_sum: number;
  mean: number;
  min_val: number;
  max_val: number;
}

export interface OverviewData {
  total_records: number;
  expected_records: number;
  is_exact_count_match: boolean;
  min_date: string;
  max_date: string;
  days_span: number;
  total_q_sum: number;
  total_s_sum: number;
  q_metrics: MetricSummary[];
  s_metrics: MetricSummary[];
}

export interface TimeSeriesPoint {
  date: string;
  record_count: number;
  'Q-P1': number;
  'Q-P2': number;
  'Q-P3': number;
  'Q-P4': number;
  'S-P1': number;
  'S-P2': number;
  'S-P3': number;
  'S-P4': number;
  q_total: number;
  s_total: number;
}

export interface TimeSeriesResponse {
  frequency: string;
  start_date: string | null;
  end_date: string | null;
  points_count: number;
  data: TimeSeriesPoint[];
}

export interface YearlyAggregateItem {
  year: number;
  record_count: number;
  qp1_sum: number;
  qp2_sum: number;
  qp3_sum: number;
  qp4_sum: number;
  sp1_sum: number;
  sp2_sum: number;
  sp3_sum: number;
  sp4_sum: number;
  q_total_sum: number;
  s_total_sum: number;
  q_growth_pct: number | null;
  s_growth_pct: number | null;
}

export interface ComparisonMetricData {
  metric: string;
  group: 'Q' | 'S';
  total: number;
  mean: number;
  median: number;
  share_of_group_pct: number;
}

export interface ComparisonsData {
  q_comparison: ComparisonMetricData[];
  s_comparison: ComparisonMetricData[];
  correlation_matrix: Record<string, Record<string, number>>;
}

export interface MetricStats {
  metric: string;
  count: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  stddev: number;
  variance: number;
  q1: number;
  q3: number;
  iqr: number;
  lower_bound: number;
  upper_bound: number;
  outlier_count: number;
  outlier_pct: number;
}

export interface OutlierItem {
  id: string | number;
  date: string;
  value: number;
  metric: string;
  type: 'high' | 'low';
  distance_from_bound: number;
}

export interface OutlierAnalysis {
  metric: string;
  q1: number;
  q3: number;
  iqr: number;
  lower_bound: number;
  upper_bound: number;
  total_records: number;
  outlier_count: number;
  outlier_pct: number;
  potential_outliers: OutlierItem[];
  explanation: string;
}

export interface OutliersData {
  explanation: string;
  metrics: Record<string, OutlierAnalysis>;
}

export interface SalesRecord {
  id: string | number;
  Date: string;
  'Q-P1': number;
  'Q-P2': number;
  'Q-P3': number;
  'Q-P4': number;
  'S-P1': number;
  'S-P2': number;
  'S-P3': number;
  'S-P4': number;
}

export interface PaginatedRecords {
  records: SalesRecord[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ColumnQuality {
  column: string;
  null_count: number;
  non_null_count: number;
  completeness_pct: number;
}

export interface DataQualityData {
  total_records: number;
  expected_records: number;
  is_exact_count_match: boolean;
  columns_quality: ColumnQuality[];
  date_continuity: {
    min_date: string;
    max_date: string;
    total_dates: number;
    distinct_dates: number;
    duplicate_dates_count: number;
  };
  summary_verdict: string;
}

export interface AIInsightResponse {
  insight: string;
  model: string;
  source_metrics_used: any;
}
