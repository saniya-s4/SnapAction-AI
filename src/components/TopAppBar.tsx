import React from 'react';
import { TabType } from '../types';

interface TopAppBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onResetHome?: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ activeTab, onSelectTab, onResetHome }) => {
  return (
    <header className="bg-surface dark:bg-[#1e232a] border-b border-outline-variant dark:border-gray-700 fixed top-0 w-full z-50 transition-colors duration-200">
      <div className="flex items-center justify-between px-4 md:px-6 h-12 w-full max-w-7xl mx-auto">
        {/* Brand */}
        <button
          onClick={() => {
            if (onResetHome) onResetHome();
            onSelectTab('upload');
          }}
          className="flex items-center gap-2 text-primary dark:text-blue-400 focus:outline-none group text-left"
        >
          <span className="material-symbols-outlined text-[24px] fill-1 text-primary dark:text-blue-400 group-hover:scale-110 transition-transform">
            bolt
          </span>
          <span className="font-bold text-[18px] md:text-[20px] text-primary dark:text-blue-400 tracking-tight">
            SnapAction AI
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-2 items-center">
          <button
            onClick={() => onSelectTab('upload')}
            className={`font-semibold text-[13px] flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === 'upload'
                ? 'text-primary dark:text-blue-400 bg-secondary-container/60 dark:bg-blue-950/60'
                : 'text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-gray-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] fill-1">add_a_photo</span>
            Upload
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`font-semibold text-[13px] flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === 'history'
                ? 'text-primary dark:text-blue-400 bg-secondary-container/60 dark:bg-blue-950/60'
                : 'text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-gray-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            History
          </button>

          <button
            onClick={() => onSelectTab('tasks')}
            className={`font-semibold text-[13px] flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === 'tasks'
                ? 'text-primary dark:text-blue-400 bg-secondary-container/60 dark:bg-blue-950/60'
                : 'text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-gray-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            Tasks
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`font-semibold text-[13px] flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === 'settings'
                ? 'text-primary dark:text-blue-400 bg-secondary-container/60 dark:bg-blue-950/60'
                : 'text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-gray-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Settings
          </button>
        </nav>
      </div>
    </header>
  );
};
