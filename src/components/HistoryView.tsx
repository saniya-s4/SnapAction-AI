import React, { useState } from 'react';
import { ScanRecord } from '../types';

interface HistoryViewProps {
  scans: ScanRecord[];
  onSelectScan: (scan: ScanRecord) => void;
  onClearHistory: () => void;
  onNewScan: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  scans,
  onSelectScan,
  onClearHistory,
  onNewScan,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      scan.documentTitle.toLowerCase().includes(search.toLowerCase()) ||
      scan.summary.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || scan.documentType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 min-h-[calc(100vh-128px)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] md:text-[28px] font-bold text-on-surface dark:text-gray-100">
            Scan History
          </h1>
          <p className="text-[14px] text-on-surface-variant dark:text-gray-400">
            Access and manage all your past AI document extractions ({scans.length} scans)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {scans.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[13px] font-semibold text-error hover:bg-error-container/20 px-3 py-1.5 rounded-lg transition-colors border border-error-container"
            >
              Clear History
            </button>
          )}
          <button
            onClick={onNewScan}
            className="text-[13px] font-semibold bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-blue-700 flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px] fill-1">add_a_photo</span>
            New Scan
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by document title or content..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface dark:bg-gray-800 text-[14px] text-on-surface dark:text-gray-200 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'receipt', 'whiteboard', 'business_card', 'document'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTypeFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap capitalize transition-all ${
                typeFilter === filter
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high'
              }`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredScans.length === 0 ? (
        <div className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-8 text-center my-8">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">
            history_toggle_off
          </span>
          <p className="text-[16px] font-semibold text-on-surface dark:text-gray-200">
            No scans match your criteria
          </p>
          <p className="text-[13px] text-on-surface-variant dark:text-gray-400 mt-1">
            Try adjusting your search query or upload a new image.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => onSelectScan(scan)}
              className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-4 flex flex-col hover:bg-surface-container-low dark:hover:bg-gray-800 transition-all cursor-pointer group shadow-xs"
            >
              <div className="w-full h-36 rounded-lg mb-3 bg-surface-variant dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                <img
                  src={scan.imageUrl}
                  alt={scan.documentTitle}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
              </div>

              <div className="flex justify-between items-start mb-1.5">
                <h3 className="font-semibold text-[15px] text-on-surface dark:text-gray-100 truncate">
                  {scan.documentTitle}
                </h3>
                <span className="bg-secondary-container dark:bg-gray-700 text-on-secondary-container dark:text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  {scan.statusBadge || 'PROCESSED'}
                </span>
              </div>

              <p className="text-[13px] text-on-surface-variant dark:text-gray-400 line-clamp-2 mb-3 flex-grow leading-snug">
                {scan.summary}
              </p>

              <div className="flex items-center justify-between text-on-surface-variant dark:text-gray-400 text-[12px] pt-2 border-t border-outline-variant/40 dark:border-gray-700">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  {scan.timestamp}
                </span>
                <span className="font-medium text-primary dark:text-blue-400 group-hover:underline">
                  {scan.actions.length} Action{scan.actions.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
