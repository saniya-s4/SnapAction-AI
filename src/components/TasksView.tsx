import React, { useState } from 'react';
import { ExtractedAction, ScanRecord } from '../types';

interface TasksViewProps {
  scans: ScanRecord[];
  onToggleTaskComplete: (actionId: string) => void;
  onEditAction: (action: ExtractedAction) => void;
  onNewScan: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  scans,
  onToggleTaskComplete,
  onEditAction,
  onNewScan,
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Gather all actions from all scans
  const allActions = scans.flatMap((s) =>
    s.actions.map((act) => ({
      ...act,
      parentDocTitle: s.documentTitle,
      parentDocId: s.id,
    }))
  );

  const filteredActions = allActions.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      (act.subtitle || '').toLowerCase().includes(search.toLowerCase()) ||
      act.parentDocTitle.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || act.type === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && act.completed) ||
      (statusFilter === 'pending' && !act.completed);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const completedCount = allActions.filter((a) => a.completed).length;
  const pendingCount = allActions.length - completedCount;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-24 min-h-[calc(100vh-128px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] md:text-[28px] font-bold text-on-surface dark:text-gray-100">
            Action Tasks
          </h1>
          <p className="text-[14px] text-on-surface-variant dark:text-gray-400">
            {pendingCount} pending, {completedCount} completed across {scans.length} scanned documents
          </p>
        </div>

        <button
          onClick={onNewScan}
          className="text-[13px] font-semibold bg-primary text-on-primary px-4 py-2 rounded-full hover:bg-blue-700 flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px] fill-1">add_a_photo</span>
          Scan Image
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks, vendors, events, tracking numbers..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface dark:bg-gray-800 text-[14px] text-on-surface dark:text-gray-200 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex bg-surface-container-low dark:bg-gray-800 p-1 rounded-lg border border-outline-variant dark:border-gray-700 self-start sm:self-auto">
            {(['all', 'pending', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md text-[12px] font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-surface-container-lowest dark:bg-gray-700 text-primary dark:text-blue-300 shadow-xs'
                    : 'text-on-surface-variant dark:text-gray-400 hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'event', 'delivery', 'payment', 'contact', 'task'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap capitalize transition-all ${
                categoryFilter === cat
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container dark:bg-gray-800 text-on-surface-variant dark:text-gray-300 hover:bg-surface-container-high'
              }`}
            >
              {cat === 'all' ? 'All Types' : cat + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      {filteredActions.length === 0 ? (
        <div className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-8 text-center my-8">
          <span className="material-symbols-outlined text-[48px] text-outline mb-2">
            assignment_turned_in
          </span>
          <p className="text-[16px] font-semibold text-on-surface dark:text-gray-200">
            No action items found
          </p>
          <p className="text-[13px] text-on-surface-variant dark:text-gray-400 mt-1">
            Try switching filters or upload an image to extract new tasks.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredActions.map((action) => (
            <div
              key={action.id}
              className={`border rounded-xl p-3.5 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                action.completed
                  ? 'bg-surface-container-low/60 dark:bg-gray-800/40 border-outline-variant/60 dark:border-gray-800 opacity-75'
                  : 'bg-surface-container-lowest dark:bg-gray-850 border-outline-variant dark:border-gray-700 hover:border-primary/50 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  onClick={() => onToggleTaskComplete(action.id)}
                  className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    action.completed
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-outline hover:border-primary text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        action.type === 'event'
                          ? 'bg-primary-container/20 text-primary dark:text-blue-300'
                          : action.type === 'delivery'
                          ? 'bg-tertiary-container/10 text-tertiary dark:text-orange-300'
                          : action.type === 'payment'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-secondary-container text-on-secondary-container dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {action.type}
                    </span>
                    <span className="text-[11px] text-on-surface-variant dark:text-gray-400 truncate">
                      from {action.parentDocTitle}
                    </span>
                  </div>

                  <h3
                    className={`font-semibold text-[15px] text-on-surface dark:text-gray-100 truncate ${
                      action.completed ? 'line-through text-on-surface-variant dark:text-gray-500' : ''
                    }`}
                  >
                    {action.title}
                  </h3>

                  <div className="text-[12px] text-on-surface-variant dark:text-gray-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    {action.details.date && <span>📅 {action.details.date}</span>}
                    {action.details.time && <span>⏰ {action.details.time}</span>}
                    {action.details.amount && <span>💵 {action.details.amount}</span>}
                    {action.details.trackingNumber && (
                      <span className="font-mono">📦 {action.details.trackingNumber}</span>
                    )}
                    {action.details.vendor && <span>🏢 {action.details.vendor}</span>}
                    {action.details.dueDate && <span>⚠️ {action.details.dueDate}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  onClick={() => onEditAction(action)}
                  className="px-3 py-1.5 rounded-lg border border-outline-variant dark:border-gray-700 text-[12px] font-semibold text-on-surface dark:text-gray-300 hover:bg-surface-container dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
