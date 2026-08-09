import React from 'react';

interface ErrorViewProps {
  errorMessage?: string;
  onRetry: () => void;
  onUploadDifferent: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  errorMessage,
  onRetry,
  onUploadDifferent,
}) => {
  return (
    <div className="flex flex-col justify-center items-center px-4 py-12 min-h-[calc(100vh-128px)]">
      <div className="bg-surface-container-lowest dark:bg-gray-850 border border-error-container dark:border-red-900/60 rounded-xl p-6 md:p-8 flex flex-col items-center text-center max-w-md w-full shadow-sm">
        {/* Error Icon Circle */}
        <div className="bg-error-container dark:bg-red-950/60 text-error dark:text-red-400 rounded-full p-4 mb-4 flex items-center justify-center h-16 w-16 shadow-xs">
          <span className="material-symbols-outlined text-[32px]">
            error_outline
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[22px] md:text-[24px] font-bold text-on-surface dark:text-gray-100 mb-2">
          Processing Failed
        </h1>

        {/* Subtitle / Message */}
        <p className="text-[14px] text-on-surface-variant dark:text-gray-300 mb-6 leading-relaxed">
          {errorMessage ||
            'Could not process the image. Please ensure the image is clear and try again, or select a different file.'}
        </p>

        {/* Buttons Stack */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="bg-primary hover:bg-blue-700 text-on-primary font-semibold text-[14px] h-12 rounded-lg w-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">refresh</span>
            Try Again
          </button>

          <button
            onClick={onUploadDifferent}
            className="bg-surface-container dark:bg-gray-800 text-primary dark:text-blue-400 font-semibold text-[14px] h-12 rounded-lg w-full flex items-center justify-center gap-2 border border-outline-variant dark:border-gray-700 hover:bg-surface-container-high transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            Upload a different image
          </button>
        </div>
      </div>
    </div>
  );
};
