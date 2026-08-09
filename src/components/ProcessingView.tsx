import React from 'react';

interface ProcessingViewProps {
  previewImageUrl?: string;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ previewImageUrl }) => {
  const defaultImage =
    previewImageUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDZu9FgAs1YU9TW-o2MZAJVC3OtS9GVhJMRja1hQq11hxgrl-DcRDYBTWvay_nvjY-zwuy8e-4rb3ygj9KiGHbqEBhEYvLbYDAxwsVt6Pw1IWNa_HsQj7TJplDbZJaD_jOZetCKYffJIsAsp5ArtiSSN-mvDo6ghJV2imc-j6-7aM3VmlxvlofIrTdAscPryfelvpHgLXr-Cll5PtbzOAPn21Opq2LL7By8n_TwtR4FDRUfGVy7xbGB7w';

  return (
    <div className="pt-4 pb-20 px-4 md:px-6 max-w-3xl mx-auto flex flex-col gap-6 min-h-[calc(100vh-128px)]">
      {/* Context Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] md:text-[30px] font-bold text-on-surface dark:text-gray-100">
          Processing Document
        </h1>
        <div className="px-3 py-1 bg-primary-container/10 text-primary dark:text-blue-400 rounded-full text-[12px] font-semibold flex items-center gap-1.5 border border-primary/20">
          <span className="w-2 h-2 rounded-full bg-primary dark:bg-blue-400 animate-pulse"></span>
          In Progress
        </div>
      </div>

      {/* Image Analyzer Card */}
      <section className="relative w-full rounded-xl overflow-hidden border border-outline-variant dark:border-gray-700 bg-surface dark:bg-gray-850 shadow-sm">
        {/* Uploaded Image */}
        <img
          src={defaultImage}
          alt="Processing Document"
          className="w-full h-48 md:h-72 object-cover object-top filter brightness-95"
        />

        {/* Semi-transparent Overlay */}
        <div className="absolute inset-0 bg-surface/80 dark:bg-gray-900/85 backdrop-blur-[3px] flex flex-col items-center justify-center p-4">
          {/* Pulsing Core */}
          <div className="relative w-20 h-20 flex items-center justify-center mb-2">
            <div className="absolute inset-0 rounded-full border-[3px] border-primary/20 dark:border-blue-400/20"></div>
            <div className="absolute inset-0 rounded-full border-[3px] border-primary dark:border-blue-400 border-t-transparent animate-[spin_1.5s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full bg-primary/10 dark:bg-blue-400/10 animate-pulse"></div>
            <span className="material-symbols-outlined text-primary dark:text-blue-400 text-[32px] fill-1">
              view_cozy
            </span>
          </div>

          {/* Status Text */}
          <p className="text-[18px] font-semibold text-on-surface dark:text-gray-100 tracking-wide animate-pulse mb-1">
            Analyzing with AI...
          </p>
          <p className="text-[14px] text-on-surface-variant dark:text-gray-300 text-center max-w-xs">
            Extracting vendor details, line items, and totals.
          </p>
        </div>
      </section>

      {/* Skeleton Loaders for Data Extraction */}
      <section className="flex flex-col gap-3">
        {/* Metadata Skeletons */}
        <div className="flex gap-2 flex-wrap mb-1">
          <div className="h-8 w-24 bg-surface-variant dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-8 w-32 bg-surface-variant dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-8 w-20 bg-surface-variant dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>

        {/* Bento-style Data Cards Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Card 1 */}
          <div className="bg-surface dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center mb-1">
              <div className="h-4 bg-surface-variant dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
              <div className="h-6 w-6 bg-surface-variant dark:bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="h-8 bg-surface-variant dark:bg-gray-700 rounded w-3/4 animate-pulse mt-1"></div>
            <div className="h-4 bg-surface-variant dark:bg-gray-700 rounded w-1/2 animate-pulse mt-1"></div>
          </div>

          {/* Card 2 */}
          <div className="bg-surface dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl p-4 flex flex-col gap-2 justify-between">
            <div className="h-4 bg-surface-variant dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
            <div className="h-10 bg-surface-variant dark:bg-gray-700 rounded w-1/2 animate-pulse self-end mt-2"></div>
          </div>
        </div>

        {/* List Item Skeletons */}
        <div className="bg-surface dark:bg-gray-800 border border-outline-variant dark:border-gray-700 rounded-xl overflow-hidden flex flex-col mt-2">
          <div className="px-4 py-2 border-b border-surface-variant dark:border-gray-700 bg-surface-container-low dark:bg-gray-850 flex justify-between">
            <div className="h-4 bg-surface-variant/60 dark:bg-gray-700 rounded w-1/5 animate-pulse"></div>
            <div className="h-4 bg-surface-variant/60 dark:bg-gray-700 rounded w-1/6 animate-pulse"></div>
          </div>
          <div className="px-4 py-4 border-b border-surface-variant dark:border-gray-700 flex justify-between items-center">
            <div className="flex flex-col gap-2 w-full">
              <div className="h-5 bg-surface-variant dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-surface-variant/70 dark:bg-gray-700/70 rounded w-1/4 animate-pulse"></div>
            </div>
            <div className="h-5 bg-surface-variant dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          </div>
          <div className="px-4 py-4 flex justify-between items-center">
            <div className="flex flex-col gap-2 w-full">
              <div className="h-5 bg-surface-variant dark:bg-gray-700 rounded w-2/5 animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="h-4 bg-surface-variant/70 dark:bg-gray-700/70 rounded w-1/3 animate-pulse" style={{ animationDelay: '150ms' }}></div>
            </div>
            <div className="h-5 bg-surface-variant dark:bg-gray-700 rounded w-20 animate-pulse" style={{ animationDelay: '150ms' }}></div>
          </div>
        </div>
      </section>
    </div>
  );
};
