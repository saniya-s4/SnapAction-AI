import React, { useEffect, useState } from 'react';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetSampleData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  onToggleDarkMode,
  onResetSampleData,
}) => {
  const [apiStatus, setApiStatus] = useState<{ checked: boolean; hasKey: boolean }>({
    checked: false,
    hasKey: false,
  });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({ checked: true, hasKey: Boolean(data.hasApiKey) });
      })
      .catch(() => {
        setApiStatus({ checked: true, hasKey: false });
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 pb-24 min-h-[calc(100vh-128px)]">
      <div className="mb-6">
        <h1 className="text-[24px] md:text-[28px] font-bold text-on-surface dark:text-gray-100">
          Settings &amp; Preferences
        </h1>
        <p className="text-[14px] text-on-surface-variant dark:text-gray-400">
          Configure application preferences and system capabilities
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Appearance Settings */}
        <div className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-5 shadow-xs">
          <h2 className="text-[16px] font-semibold text-on-surface dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              palette
            </span>
            Appearance
          </h2>

          <div className="flex items-center justify-between py-2 border-t border-outline-variant/40 dark:border-gray-700">
            <div>
              <p className="text-[14px] font-medium text-on-surface dark:text-gray-200">
                Dark Mode
              </p>
              <p className="text-[12px] text-on-surface-variant dark:text-gray-400">
                Toggle high-contrast eye-safe dark theme
              </p>
            </div>

            <button
              onClick={onToggleDarkMode}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                darkMode ? 'bg-primary justify-end' : 'bg-gray-300 dark:bg-gray-700 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs"></span>
            </button>
          </div>
        </div>

        {/* Gemini AI Status */}
        <div className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-5 shadow-xs">
          <h2 className="text-[16px] font-semibold text-on-surface dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              auto_awesome
            </span>
            Gemini AI Vision Engine
          </h2>

          <div className="py-2 border-t border-outline-variant/40 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-on-surface dark:text-gray-200">
                Gemini 3.6 Flash Server Status
              </p>
              <p className="text-[12px] text-on-surface-variant dark:text-gray-400">
                Server-side OCR &amp; action extraction service
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-[12px] font-semibold flex items-center gap-1.5 ${
                apiStatus.hasKey
                  ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiStatus.hasKey ? 'bg-green-500 animate-pulse' : 'bg-amber-500'
                }`}
              ></span>
              {apiStatus.hasKey ? 'Connected & Ready' : 'Demo / Standby Mode'}
            </span>
          </div>

          <p className="text-[12px] text-on-surface-variant dark:text-gray-400 mt-3 pt-3 border-t border-outline-variant/30 dark:border-gray-800">
            You can configure or update your Gemini API key anytime in the <strong>Settings &gt; Secrets</strong> panel.
          </p>
        </div>

        {/* Data Reset & Controls */}
        <div className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-5 shadow-xs">
          <h2 className="text-[16px] font-semibold text-on-surface dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              database
            </span>
            Data &amp; Presets
          </h2>

          <div className="flex items-center justify-between py-2 border-t border-outline-variant/40 dark:border-gray-700">
            <div>
              <p className="text-[14px] font-medium text-on-surface dark:text-gray-200">
                Reset Sample Scans
              </p>
              <p className="text-[12px] text-on-surface-variant dark:text-gray-400">
                Reload initial mock dataset (Receipts, Whiteboard, Business Card)
              </p>
            </div>

            <button
              onClick={onResetSampleData}
              className="px-4 py-2 bg-surface-container dark:bg-gray-700 text-primary dark:text-blue-300 text-[13px] font-semibold rounded-lg hover:bg-surface-container-high transition-colors"
            >
              Restore Samples
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
