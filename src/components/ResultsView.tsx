import React, { useState } from 'react';
import { ExtractedAction, ScanRecord } from '../types';

interface ResultsViewProps {
  scanRecord: ScanRecord;
  onNewScan: () => void;
  onEditAction: (action: ExtractedAction) => void;
  onToggleCompleteAction: (actionId: string) => void;
  onAddAction: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  scanRecord,
  onNewScan,
  onEditAction,
  onToggleCompleteAction,
  onAddAction,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyDetails = (action: ExtractedAction) => {
    const textToCopy = `Title: ${action.title}\nDetails: ${JSON.stringify(action.details, null, 2)}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(action.id);
    showToast('Details copied to clipboard!');
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleAddToCalendar = (action: ExtractedAction) => {
    const { date = 'Oct 24, 2023', time = '2:00 PM - 4:00 PM', location = '' } = action.details;
    // Generate .ics content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SnapAction AI//Event//EN
BEGIN:VEVENT
SUMMARY:${action.title}
DESCRIPTION:Extracted via SnapAction AI from document ${scanRecord.documentTitle}
LOCATION:${location}
DTSTART:20231024T140000Z
DTEND:20231024T160000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${action.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Calendar invite downloaded for "${action.title}"`);
  };

  const handleTrackPackage = (action: ExtractedAction) => {
    const trackingNum = action.details.trackingNumber || '1Z9999W99999999999';
    window.open(`https://www.google.com/search?q=${encodeURIComponent(trackingNum + ' tracking')}`, '_blank');
    showToast(`Opening tracking search for ${trackingNum}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 pt-4 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-lg shadow-lg text-[13px] font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-green-400">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Image Preview Header */}
      <section className="mb-6 flex flex-col items-center text-center">
        <div className="relative w-full md:w-2/3 max-w-lg aspect-video rounded-xl overflow-hidden border border-outline-variant dark:border-gray-700 bg-surface-container-low dark:bg-gray-800 shadow-sm mb-4 group">
          <img
            src={scanRecord.imageUrl}
            alt={scanRecord.documentTitle}
            className="w-full h-full object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
            <span className="bg-secondary-container dark:bg-blue-900/80 text-on-secondary-container dark:text-blue-100 font-semibold text-[12px] px-2.5 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              {scanRecord.statusBadge || 'Processed'}
            </span>
          </div>
        </div>

        <h1 className="text-[24px] md:text-[30px] font-bold text-on-surface dark:text-gray-100">
          Extracted Actions
        </h1>
        <p className="text-[14px] md:text-[15px] text-on-surface-variant dark:text-gray-400 mt-1">
          {scanRecord.summary || `We found ${scanRecord.actions.length} actionable items from your image.`}
        </p>

        <div className="mt-4 flex gap-2 flex-wrap justify-center">
          <button
            onClick={onNewScan}
            className="text-[13px] font-semibold bg-surface-container dark:bg-gray-800 text-primary dark:text-blue-400 hover:bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant dark:border-gray-700 flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
            Scan Another Image
          </button>

          <button
            onClick={onAddAction}
            className="text-[13px] font-semibold bg-primary-container text-on-primary-container px-4 py-2 rounded-full hover:brightness-105 flex items-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Action Item
          </button>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {scanRecord.actions.map((action) => {
          if (action.type === 'event') {
            return (
              <div
                key={action.id}
                className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:bg-surface-bright dark:hover:bg-gray-800 transition-colors group shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-primary dark:text-blue-400">
                    <span className="material-symbols-outlined p-2 bg-primary-container/20 dark:bg-blue-900/50 rounded-full text-[20px]">
                      event
                    </span>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">
                      {action.statusBadge || 'EVENT'}
                    </span>
                  </div>
                  <button
                    onClick={() => onEditAction(action)}
                    className="text-on-surface-variant dark:text-gray-400 hover:text-primary transition-colors p-1"
                    title="Edit Item"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>

                <h3 className="text-[18px] font-semibold text-on-surface dark:text-gray-100 leading-tight">
                  {action.title}
                </h3>

                <div className="space-y-1.5 text-[13px] text-on-surface-variant dark:text-gray-300 font-normal">
                  {action.details.date && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline dark:text-gray-400">
                        calendar_month
                      </span>
                      <span>{action.details.date}</span>
                    </div>
                  )}
                  {action.details.time && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline dark:text-gray-400">
                        schedule
                      </span>
                      <span>{action.details.time}</span>
                    </div>
                  )}
                  {action.details.location && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline dark:text-gray-400">
                        location_on
                      </span>
                      <span>{action.details.location}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-2">
                  <button
                    onClick={() => handleAddToCalendar(action)}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-700 text-on-primary font-semibold text-[14px] py-2.5 px-4 rounded-lg transition-transform duration-200 active:scale-[0.98] h-11 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                    {action.primaryActionLabel || 'Add to Calendar'}
                  </button>
                </div>
              </div>
            );
          }

          if (action.type === 'delivery') {
            return (
              <div
                key={action.id}
                className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:bg-surface-bright dark:hover:bg-gray-800 transition-colors group shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-tertiary dark:text-orange-400">
                    <span className="material-symbols-outlined p-2 bg-tertiary-container/10 dark:bg-orange-950/40 text-tertiary dark:text-orange-400 rounded-full text-[20px]">
                      local_shipping
                    </span>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">
                      DELIVERY
                    </span>
                  </div>
                  <span className="bg-tertiary-container/10 dark:bg-orange-950/50 text-tertiary dark:text-orange-300 font-semibold text-[11px] px-2 py-0.5 rounded-md">
                    {action.details.deliveryStatus || action.statusBadge || 'In Transit'}
                  </span>
                </div>

                <h3 className="text-[18px] font-semibold text-on-surface dark:text-gray-100 leading-tight">
                  {action.title}
                </h3>

                <div className="space-y-1.5 text-[13px] text-on-surface-variant dark:text-gray-300 font-normal">
                  {action.details.trackingNumber && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline dark:text-gray-400">
                        tag
                      </span>
                      <span className="font-mono text-[12px] tracking-wide">{action.details.trackingNumber}</span>
                    </div>
                  )}
                  {action.details.carrier && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline dark:text-gray-400">
                        storefront
                      </span>
                      <span>{action.details.carrier}</span>
                    </div>
                  )}
                  {action.details.estimatedDelivery && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline dark:text-gray-400">
                        today
                      </span>
                      <span>{action.details.estimatedDelivery}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-2">
                  <button
                    onClick={() => handleTrackPackage(action)}
                    className="w-full flex items-center justify-center gap-2 border border-outline dark:border-gray-600 text-on-surface dark:text-gray-200 font-semibold text-[14px] py-2.5 px-4 rounded-lg hover:bg-surface-container-high dark:hover:bg-gray-750 transition-transform duration-200 active:scale-[0.98] h-11"
                  >
                    <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                    {action.primaryActionLabel || 'Track Package'}
                  </button>
                </div>
              </div>
            );
          }

          if (action.type === 'payment') {
            return (
              <div
                key={action.id}
                className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:bg-surface-bright dark:hover:bg-gray-800 transition-colors group shadow-xs md:col-span-2 lg:col-span-1"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-[#006A60] dark:text-emerald-400">
                    <span className="material-symbols-outlined p-2 bg-[#006A60]/10 dark:bg-emerald-950/40 text-[#006A60] dark:text-emerald-400 rounded-full text-[20px]">
                      receipt_long
                    </span>
                    <span className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">
                      PAYMENT
                    </span>
                  </div>
                  <span className="bg-error-container/60 dark:bg-red-950/60 text-on-error-container dark:text-red-300 font-semibold text-[11px] px-2 py-0.5 rounded-md">
                    {action.statusBadge || 'Due Soon'}
                  </span>
                </div>

                <div>
                  <h3 className="text-[24px] font-bold text-on-surface dark:text-gray-100 leading-none">
                    {action.title}
                  </h3>
                  {action.subtitle && (
                    <p className="text-[13px] text-on-surface-variant dark:text-gray-400 mt-1">
                      {action.subtitle}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 text-[13px] text-on-surface-variant dark:text-gray-300">
                  {action.details.vendor && (
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-outline dark:text-gray-400">
                        person
                      </span>
                      <span>{action.details.vendor}</span>
                    </div>
                  )}
                  {action.details.dueDate && (
                    <div className="flex items-center gap-2 text-error dark:text-red-400 font-medium">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      <span>{action.details.dueDate}</span>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-2 flex gap-2">
                  <button
                    onClick={() => handleCopyDetails(action)}
                    className={`flex-1 flex items-center justify-center gap-1.5 font-semibold text-[14px] py-2 px-3 rounded-lg transition-transform duration-200 active:scale-[0.98] h-11 ${
                      copiedId === action.id
                        ? 'bg-primary-container text-on-primary-container'
                        : 'bg-surface-container dark:bg-gray-700 text-primary dark:text-blue-300 hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedId === action.id ? 'check' : 'content_copy'}
                    </span>
                    {copiedId === action.id ? 'Copied!' : action.primaryActionLabel || 'Copy Details'}
                  </button>
                  <button
                    onClick={() => onEditAction(action)}
                    className="w-11 h-11 flex items-center justify-center border border-outline dark:border-gray-600 rounded-lg text-on-surface dark:text-gray-200 hover:bg-surface-container-high dark:hover:bg-gray-700 transition-transform active:scale-[0.98]"
                    title="Edit Details"
                  >
                    <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                  </button>
                </div>
              </div>
            );
          }

          // Fallback / General / Contact / Task Card
          return (
            <div
              key={action.id}
              className="bg-surface-container-lowest dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3 hover:bg-surface-bright dark:hover:bg-gray-800 transition-colors group shadow-xs"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-primary dark:text-blue-400">
                  <span className="material-symbols-outlined p-2 bg-primary-container/20 dark:bg-blue-900/50 rounded-full text-[20px]">
                    {action.type === 'contact' ? 'badge' : 'task_alt'}
                  </span>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-on-surface-variant dark:text-gray-400">
                    {action.type.toUpperCase()}
                  </span>
                </div>
                <span className="bg-secondary-container/60 dark:bg-gray-700 text-on-secondary-container dark:text-gray-200 font-semibold text-[11px] px-2 py-0.5 rounded-md">
                  {action.statusBadge || 'PROCESSED'}
                </span>
              </div>

              <div>
                <h3 className="text-[17px] font-semibold text-on-surface dark:text-gray-100">
                  {action.title}
                </h3>
                {action.subtitle && (
                  <p className="text-[13px] text-on-surface-variant dark:text-gray-400 mt-0.5">
                    {action.subtitle}
                  </p>
                )}
              </div>

              <div className="space-y-1 text-[13px] text-on-surface-variant dark:text-gray-300">
                {action.details.email && <p>Email: {action.details.email}</p>}
                {action.details.phone && <p>Phone: {action.details.phone}</p>}
                {action.details.company && <p>Company: {action.details.company}</p>}
                {action.details.description && <p>{action.details.description}</p>}
              </div>

              <div className="mt-auto pt-2 flex gap-2">
                <button
                  onClick={() => onToggleCompleteAction(action.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 font-semibold text-[13px] py-2 px-3 rounded-lg transition-transform h-11 ${
                    action.completed
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                      : 'bg-primary text-on-primary hover:bg-blue-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {action.completed ? 'check_circle' : 'check'}
                  </span>
                  {action.completed ? 'Completed' : 'Mark Done'}
                </button>
                <button
                  onClick={() => onEditAction(action)}
                  className="w-11 h-11 flex items-center justify-center border border-outline dark:border-gray-600 rounded-lg text-on-surface dark:text-gray-200 hover:bg-surface-container-high transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
