import React, { useRef, useState } from 'react';
import { ScanRecord } from '../types';

interface HomeUploadViewProps {
  recentScans: ScanRecord[];
  onUploadImage: (file: File) => void;
  onSelectSampleScan: (record: ScanRecord) => void;
  onSelectHistoryCard: (record: ScanRecord) => void;
  onViewAllHistory: () => void;
  onTriggerErrorDemo?: () => void;
}

export const HomeUploadView: React.FC<HomeUploadViewProps> = ({
  recentScans,
  onUploadImage,
  onSelectSampleScan,
  onSelectHistoryCard,
  onViewAllHistory,
  onTriggerErrorDemo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadImage(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 min-h-[calc(100vh-128px)]">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Welcome Section */}
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-[24px] md:text-[30px] font-bold text-on-surface dark:text-gray-100 mb-2 tracking-tight">
          Ready to scan?
        </h2>
        <p className="text-[15px] md:text-[16px] text-on-surface-variant dark:text-gray-400">
          Upload an image or screenshot to extract text, identify objects, and generate tasks instantly.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[280px] mb-8 transition-all cursor-pointer group ${
          isDragging
            ? 'bg-secondary-container/40 border-primary scale-[0.99]'
            : 'bg-surface-container-low dark:bg-gray-800/40 border-outline-variant dark:border-gray-700 hover:bg-surface-container dark:hover:bg-gray-800 hover:border-primary'
        }`}
      >
        <div className="bg-primary-container text-on-primary-container rounded-full p-4 mb-4 group-hover:scale-105 transition-transform shadow-sm">
          <span className="material-symbols-outlined text-[36px] block">
            cloud_upload
          </span>
        </div>
        <h3 className="text-[18px] md:text-[20px] font-semibold text-on-surface dark:text-gray-100 mb-1">
          Drag &amp; drop your image here
        </h3>
        <p className="text-[14px] text-on-surface-variant dark:text-gray-400 mb-6">
          or click to browse from your device
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="bg-primary hover:bg-blue-700 text-on-primary font-semibold text-[14px] px-6 py-2.5 rounded-full flex items-center gap-2 transition-transform duration-200 active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px] fill-1">add_a_photo</span>
          Upload Image
        </button>
      </div>

      {/* Quick Test Demo Cards Row */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] uppercase font-bold tracking-wider text-on-surface-variant dark:text-gray-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
            Quick Sample Scans
          </span>
          {onTriggerErrorDemo && (
            <button
              onClick={onTriggerErrorDemo}
              className="text-[12px] font-semibold text-error hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">error_outline</span>
              Simulate Error State
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {recentScans.slice(0, 3).map((scan) => (
            <button
              key={`preset-${scan.id}`}
              onClick={() => onSelectSampleScan(scan)}
              className="bg-surface-container-lowest dark:bg-gray-800 border border-outline-variant dark:border-gray-700 hover:border-primary px-3 py-2 rounded-lg text-left text-[13px] font-medium text-on-surface dark:text-gray-200 flex items-center gap-2 shrink-0 transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                {scan.documentType === 'receipt'
                  ? 'receipt_long'
                  : scan.documentType === 'whiteboard'
                  ? 'draw'
                  : 'badge'}
              </span>
              <span>{scan.documentTitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent History Section (Bento Grid) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] md:text-[20px] font-semibold text-on-surface dark:text-gray-100">
            Recent History
          </h3>
          <button
            onClick={onViewAllHistory}
            className="text-[12px] font-semibold text-primary dark:text-blue-400 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentScans.slice(0, 3).map((scan, idx) => {
            const isSpecialSparkleCard = idx === 2; // Business card with AI feedback style
            return (
              <div
                key={scan.id}
                onClick={() => onSelectHistoryCard(scan)}
                className={`border rounded-xl p-4 flex flex-col hover:bg-surface-container-low dark:hover:bg-gray-800/80 transition-colors cursor-pointer group relative overflow-hidden shadow-xs ${
                  isSpecialSparkleCard
                    ? 'bg-[#f0f4ff] dark:bg-blue-950/40 border-primary/20 dark:border-blue-700/30'
                    : 'bg-surface-container-lowest dark:bg-gray-850 border-outline-variant dark:border-gray-700'
                }`}
              >
                {isSpecialSparkleCard && (
                  <div className="absolute top-0 right-0 p-2.5 text-primary dark:text-blue-400">
                    <span className="material-symbols-outlined text-[20px]">
                      auto_awesome
                    </span>
                  </div>
                )}

                <div className="w-full h-32 rounded-lg mb-3 bg-surface-variant dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img
                    src={scan.imageUrl}
                    alt={scan.documentTitle}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                </div>

                <div className="flex justify-between items-start mb-1.5">
                  <h4 className={`font-semibold text-[14px] text-on-surface dark:text-gray-100 truncate ${isSpecialSparkleCard ? 'pr-6' : ''}`}>
                    {scan.documentTitle}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      scan.statusBadge === 'CONTACT ADDED'
                        ? 'bg-primary/10 text-primary dark:bg-blue-900/60 dark:text-blue-300'
                        : 'bg-secondary-container dark:bg-gray-700 text-on-secondary-container dark:text-gray-200'
                    }`}
                  >
                    {scan.statusBadge}
                  </span>
                </div>

                <p className="text-[13px] text-on-surface-variant dark:text-gray-400 line-clamp-2 mb-3 flex-grow leading-snug">
                  {scan.summary}
                </p>

                <div className="flex items-center text-on-surface-variant dark:text-gray-400 text-[12px] gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {scan.timestamp}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
