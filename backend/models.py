from typing import Any
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    database: dict[str, Any]

class ConnectionTestRequest(BaseModel):
    database_url: str

class ConnectionTestResponse(BaseModel):
    success: bool
    connected: bool
    record_count: int | None = None
    expected_count: int = 4574
    is_exact_count_match: bool = False
    date_range: dict[str, Any] | None = None
    latency_ms: float | None = None
    error: str | None = None

class ConnectionSaveRequest(BaseModel):
    database_url: str

class MetricSummary(BaseModel):
    metric: str
    total_sum: float
    mean: float
    min_val: float
    max_val: float

class OverviewResponse(BaseModel):
    total_records: int
    expected_records: int = 4574
    is_exact_count_match: bool
    min_date: str
    max_date: str
    days_span: int
    total_q_sum: float
    total_s_sum: float
    q_metrics: list[MetricSummary]
    s_metrics: list[MetricSummary]

class TimeSeriesPoint(BaseModel):
    date: str
    record_count: int = 1
    # Individual metrics
    qp1: float = Field(alias="Q-P1", default=0.0)
    qp2: float = Field(alias="Q-P2", default=0.0)
    qp3: float = Field(alias="Q-P3", default=0.0)
    qp4: float = Field(alias="Q-P4", default=0.0)
    sp1: float = Field(alias="S-P1", default=0.0)
    sp2: float = Field(alias="S-P2", default=0.0)
    sp3: float = Field(alias="S-P3", default=0.0)
    sp4: float = Field(alias="S-P4", default=0.0)
    q_total: float = 0.0
    s_total: float = 0.0

    class Config:
        populate_by_name = True

class TimeSeriesResponse(BaseModel):
    frequency: str
    start_date: str | None
    end_date: str | None
    points_count: int
    data: list[dict[str, Any]]

class YearlyAggregateItem(BaseModel):
    year: int
    record_count: int
    qp1_sum: float
    qp2_sum: float
    qp3_sum: float
    qp4_sum: float
    sp1_sum: float
    sp2_sum: float
    sp3_sum: float
    sp4_sum: float
    q_total_sum: float
    s_total_sum: float
    # YoY growth percentages (None for first year)
    q_growth_pct: float | None = None
    s_growth_pct: float | None = None

class MetricStats(BaseModel):
    metric: str
    count: int
    min: float
    max: float
    mean: float
    median: float
    stddev: float
    variance: float
    q1: float
    q3: float
    iqr: float
    lower_bound: float
    upper_bound: float
    outlier_count: int
    outlier_pct: float

class OutlierItem(BaseModel):
    id: Any
    date: str
    value: float
    metric: str
    type: str  # "high" or "low"
    distance_from_bound: float

class OutlierAnalysis(BaseModel):
    metric: str
    q1: float
    q3: float
    iqr: float
    lower_bound: float
    upper_bound: float
    total_records: int
    outlier_count: int
    outlier_pct: float
    potential_outliers: list[OutlierItem]
    explanation: str

class OutliersResponse(BaseModel):
    explanation: str
    metrics: dict[str, OutlierAnalysis]

class ComparisonMetricData(BaseModel):
    metric: str
    group: str # "Q" or "S"
    total: float
    mean: float
    median: float
    share_of_group_pct: float

class ComparisonsResponse(BaseModel):
    q_comparison: list[ComparisonMetricData]
    s_comparison: list[ComparisonMetricData]
    correlation_matrix: dict[str, dict[str, float]]

class SalesRecord(BaseModel):
    id: Any
    date: str = Field(alias="Date")
    qp1: float = Field(alias="Q-P1")
    qp2: float = Field(alias="Q-P2")
    qp3: float = Field(alias="Q-P3")
    qp4: float = Field(alias="Q-P4")
    sp1: float = Field(alias="S-P1")
    sp2: float = Field(alias="S-P2")
    sp3: float = Field(alias="S-P3")
    sp4: float = Field(alias="S-P4")

    class Config:
        populate_by_name = True

class PaginatedRecordsResponse(BaseModel):
    records: list[dict[str, Any]]
    total: int
    page: int
    page_size: int
    total_pages: int

class ColumnQuality(BaseModel):
    column: str
    null_count: int
    non_null_count: int
    completeness_pct: float

class DataQualityResponse(BaseModel):
    total_records: int
    expected_records: int = 4574
    is_exact_count_match: bool
    columns_quality: list[ColumnQuality]
    date_continuity: dict[str, Any]
    summary_verdict: str

class AIInsightRequest(BaseModel):
    context: str = "general" # "overview" | "yearly" | "statistics" | "outliers" | "comparisons"
    user_prompt: str | None = None

class AIInsightResponse(BaseModel):
    insight: str
    model: str
    source_metrics_used: dict[str, Any]
