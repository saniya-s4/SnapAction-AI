import React from 'react';
import { TabType } from '../types';

interface BottomNavBarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="md:hidden bg-surface dark:bg-[#1e232a] text-primary dark:text-blue-400 fixed bottom-0 w-full z-50 flex justify-around items-center h-16 px-2 border-t border-outline-variant dark:border-gray-700 transition-colors duration-200 shadow-sm">
      {/* Upload Tab */}
      <button
        onClick={() => onSelectTab('upload')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 px-4 py-1 rounded-full ${
          activeTab === 'upload'
            ? 'bg-secondary-container dark:bg-blue-900/50 text-on-secondary-container dark:text-blue-200'
            : 'text-on-surface-variant dark:text-gray-400 hover:bg-surface-container dark:hover:bg-gray-800'
        }`}
      >
        <span className={`material-symbols-outlined text-[24px] ${activeTab === 'upload' ? 'fill-1' : ''}`}>
          add_a_photo
        </span>
        <span className="font-semibold text-[12px] mt-0.5">Upload</span>
      </button>

      {/* History Tab */}
      <button
        onClick={() => onSelectTab('history')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 px-4 py-1 rounded-full ${
          activeTab === 'history'
            ? 'bg-secondary-container dark:bg-blue-900/50 text-on-secondary-container dark:text-blue-200'
            : 'text-on-surface-variant dark:text-gray-400 hover:bg-surface-container dark:hover:bg-gray-800'
        }`}
      >
        <span className={`material-symbols-outlined text-[24px] ${activeTab === 'history' ? 'fill-1' : ''}`}>
          history
        </span>
        <span className="font-semibold text-[12px] mt-0.5">History</span>
      </button>

      {/* Tasks Tab */}
      <button
        onClick={() => onSelectTab('tasks')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 px-4 py-1 rounded-full ${
          activeTab === 'tasks'
            ? 'bg-secondary-container dark:bg-blue-900/50 text-on-secondary-container dark:text-blue-200'
            : 'text-on-surface-variant dark:text-gray-400 hover:bg-surface-container dark:hover:bg-gray-800'
        }`}
      >
        <span className={`material-symbols-outlined text-[24px] ${activeTab === 'tasks' ? 'fill-1' : ''}`}>
          assignment_turned_in
        </span>
        <span className="font-semibold text-[12px] mt-0.5">Tasks</span>
      </button>

      {/* Settings Tab */}
      <button
        onClick={() => onSelectTab('settings')}
        className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 px-4 py-1 rounded-full ${
          activeTab === 'settings'
            ? 'bg-secondary-container dark:bg-blue-900/50 text-on-secondary-container dark:text-blue-200'
            : 'text-on-surface-variant dark:text-gray-400 hover:bg-surface-container dark:hover:bg-gray-800'
        }`}
      >
        <span className={`material-symbols-outlined text-[24px] ${activeTab === 'settings' ? 'fill-1' : ''}`}>
          settings
        </span>
        <span className="font-semibold text-[12px] mt-0.5">Settings</span>
      </button>
    </nav>
  );
};
