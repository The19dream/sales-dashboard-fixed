import React, { useState, useEffect } from 'react';
import { SalesRecord } from '../types';
import { api } from '../services/api';
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  TableProperties,
} from 'lucide-react';

interface DataTableSectionProps {
  onOpenConnect?: () => void;
}

export const DataTableSection: React.FC<DataTableSectionProps> = ({ onOpenConnect }) => {
  const [records, setRecords] = useState<SalesRecord[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [sortBy, setSortBy] = useState<string>('Date');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');
  const [search, setSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRecords({
        page,
        pageSize,
        sortBy,
        sortDir,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: search.trim() || undefined,
      });
      setRecords(res.records);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (err: any) {
      setError(err.message || 'Failed to query records ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [page, pageSize, sortBy, sortDir]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRecords();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortDir('DESC');
    }
    setPage(1);
  };

  const exportUrl = api.getExportUrl({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    search: search.trim() || undefined,
  });

  const columns = [
    { key: 'id', label: 'ID', align: 'left' },
    { key: 'Date', label: 'DATE', align: 'left' },
    { key: 'Q-P1', label: 'Q-P1', align: 'right' },
    { key: 'Q-P2', label: 'Q-P2', align: 'right' },
    { key: 'Q-P3', label: 'Q-P3', align: 'right' },
    { key: 'Q-P4', label: 'Q-P4', align: 'right' },
    { key: 'S-P1', label: 'S-P1', align: 'right' },
    { key: 'S-P2', label: 'S-P2', align: 'right' },
    { key: 'S-P3', label: 'S-P3', align: 'right' },
    { key: 'S-P4', label: 'S-P4', align: 'right' },
  ];

  return (
    <div className="space-y-4">
      {/* Terminal Query Toolbar */}
      <div className="bg-[#101314] border border-[#22282C] p-5 space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search with Terminal Prompt */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-2.5 font-mono text-[#C7FF3D] text-xs">&gt;</span>
            <input
              type="text"
              placeholder="QUERY DATABASE BY DATE OR RECORD ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#090B0A] border border-[#2B3338] pl-7 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#C7FF3D] font-mono tracking-wider"
            />
          </form>

          {/* Date Range & Actions */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="flex items-center space-x-1.5 bg-[#090B0A] px-2.5 py-1.5 border border-[#22282C]">
              <span className="text-zinc-500 text-[10px]">RANGE:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-white text-xs font-mono focus:outline-none"
              />
              <span className="text-zinc-600">&rarr;</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent text-white text-xs font-mono focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setPage(1);
                fetchRecords();
              }}
              className="px-3.5 py-1.5 bg-[#161A1C] hover:bg-[#20262A] text-white border border-[#2B3338] hover:border-[#C7FF3D] transition"
            >
              FILTER
            </button>

            <a
              href={exportUrl}
              download="sales_data_export.csv"
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold transition shadow-[0_0_10px_rgba(199,255,61,0.2)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT CSV</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="bg-[#101314] border border-[#22282C] overflow-hidden">
        <div className="px-5 py-3 border-b border-[#22282C] flex items-center justify-between text-xs font-mono text-zinc-400">
          <div>
            SHOWING <strong className="text-white">{((page - 1) * pageSize) + 1}</strong> TO{' '}
            <strong className="text-white">{Math.min(page * pageSize, total)}</strong> OF{' '}
            <strong className="text-[#C7FF3D]">{total.toLocaleString()}</strong> RECORDS
          </div>
          <div className="flex items-center space-x-2">
            <span>PAGE SIZE:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-[#090B0A] border border-[#2B3338] px-2 py-1 text-white text-xs font-mono focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-3 text-xs font-mono text-zinc-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#C7FF3D]" />
            <span>FETCHING RAW OBSERVATIONS FROM PUBLIC.SALES_DATA...</span>
          </div>
        ) : error ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-10 h-10 bg-[#FF5C8D]/10 border border-[#FF5C8D]/40 text-[#FF5C8D] font-mono font-bold flex items-center justify-center">
              !
            </div>
            <div className="text-xs font-mono text-zinc-400">
              AWAITING DATABASE QUERY &bull; CONNECT DATABASE TO BROWSE LIVE RECORDS
            </div>
            {onOpenConnect && (
              <button
                onClick={onOpenConnect}
                className="px-3.5 py-1.5 bg-[#C7FF3D] hover:bg-[#B5F525] text-[#090B0A] font-bold text-xs font-mono transition"
              >
                CONNECT DATABASE
              </button>
            )}
          </div>
        ) : records.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 text-xs font-mono">
            NO EMPIRICAL OBSERVATIONS MATCH SPECIFIED QUERY CRITERIA.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#090B0A] text-zinc-400 font-mono text-[10px] tracking-wider uppercase border-b border-[#22282C] select-none">
                <tr>
                  {columns.map((c) => {
                    const isSorted = sortBy === c.key;
                    return (
                      <th
                        key={c.key}
                        onClick={() => handleSort(c.key)}
                        className={`py-3 px-4 cursor-pointer hover:bg-[#15191B] transition ${
                          c.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <div className={`inline-flex items-center space-x-1.5 ${c.align === 'right' ? 'justify-end w-full' : ''}`}>
                          <span>{c.label}</span>
                          {isSorted ? (
                            sortDir === 'ASC' ? (
                              <ArrowUp className="w-3 h-3 text-[#C7FF3D]" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-[#C7FF3D]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-zinc-700" />
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1F23] font-mono text-zinc-300">
                {records.map((r, i) => (
                  <tr key={r.id ?? i} className="hover:bg-[#15191B] transition-colors">
                    <td className="py-2.5 px-4 text-zinc-500 font-bold">{r.id}</td>
                    <td className="py-2.5 px-4 text-white font-semibold">{r.Date}</td>
                    <td className="py-2.5 px-4 text-right text-[#C7FF3D]">{r['Q-P1']?.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-[#C7FF3D]">{r['Q-P2']?.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-[#C7FF3D]">{r['Q-P3']?.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-[#C7FF3D]">{r['Q-P4']?.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-[#00F0FF]">{r['S-P1']?.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-[#00F0FF]">{r['S-P2']?.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-[#00F0FF]">{r['S-P3']?.toLocaleString()}</td>
                    <td className="py-2.5 px-4 text-right text-[#00F0FF]">{r['S-P4']?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Technical Pagination Bar */}
        <div className="px-5 py-3 border-t border-[#22282C] bg-[#0D0F10] flex items-center justify-between text-xs font-mono">
          <div className="text-zinc-500">
            PAGE <span className="text-white font-bold">{page}</span> // {totalPages}
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || loading}
              className="p-1.5 bg-[#161A1C] hover:bg-[#20262A] border border-[#22282C] text-zinc-300 disabled:opacity-30 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-mono text-[#C7FF3D] bg-[#090B0A] border border-[#22282C]">
              {page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || loading}
              className="p-1.5 bg-[#161A1C] hover:bg-[#20262A] border border-[#22282C] text-zinc-300 disabled:opacity-30 transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
