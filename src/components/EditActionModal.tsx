import React, { useState } from 'react';
import { ExtractedAction } from '../types';

interface EditActionModalProps {
  action: ExtractedAction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAction: ExtractedAction) => void;
  onDelete?: (actionId: string) => void;
}

export const EditActionModal: React.FC<EditActionModalProps> = ({
  action,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !action) return null;

  const [title, setTitle] = useState(action.title || '');
  const [subtitle, setSubtitle] = useState(action.subtitle || '');
  const [type, setType] = useState(action.type || 'task');
  const [statusBadge, setStatusBadge] = useState(action.statusBadge || '');
  const [date, setDate] = useState(action.details.date || '');
  const [time, setTime] = useState(action.details.time || '');
  const [location, setLocation] = useState(action.details.location || '');
  const [amount, setAmount] = useState(action.details.amount || '');
  const [vendor, setVendor] = useState(action.details.vendor || '');
  const [trackingNumber, setTrackingNumber] = useState(action.details.trackingNumber || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ExtractedAction = {
      ...action,
      title,
      subtitle,
      type,
      statusBadge: statusBadge || type.toUpperCase(),
      details: {
        ...action.details,
        date,
        time,
        location,
        amount,
        vendor,
        trackingNumber,
      },
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface dark:bg-gray-850 border border-outline-variant dark:border-gray-700 rounded-xl p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant/40 dark:border-gray-700">
          <h3 className="text-[18px] font-bold text-on-surface dark:text-gray-100">
            Edit Action Item
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-md"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-[14px]">
          <div>
            <label className="block font-semibold text-on-surface dark:text-gray-200 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface-container-lowest dark:bg-gray-800 text-on-surface dark:text-gray-200 focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-on-surface dark:text-gray-200 mb-1">
                Category Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface-container-lowest dark:bg-gray-800 text-on-surface dark:text-gray-200 focus:outline-none focus:border-primary"
              >
                <option value="event">Event</option>
                <option value="delivery">Delivery</option>
                <option value="payment">Payment</option>
                <option value="contact">Contact</option>
                <option value="task">Task</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-on-surface dark:text-gray-200 mb-1">
                Badge Status
              </label>
              <input
                type="text"
                value={statusBadge}
                onChange={(e) => setStatusBadge(e.target.value)}
                placeholder="e.g. In Transit"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface-container-lowest dark:bg-gray-800 text-on-surface dark:text-gray-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {type === 'event' && (
            <>
              <div>
                <label className="block font-semibold text-on-surface dark:text-gray-200 mb-1">
                  Date
                </label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Oct 24, 2023"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface-container-lowest dark:bg-gray-800 text-on-surface dark:text-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-on-surface dark:text-gray-200 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="2:00 PM - 4:00 PM"
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface-container-lowest dark:bg-gray-800 text-on-surface dark:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface dark:text-gray-200 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Studio 4B, NY"
                    className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface-container-lowest dark:bg-gray-800 text-on-surface dark:text-gray-200"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'delivery' && (
            <div>
              <label className="block font-semibold text-on-surface dark:text-gray-200 mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="1Z9999W99999999999"
                className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface-container-lowest dark:bg-gray-800 text-on-surface dark:text-gray-200"
              />
            </div>
          )}

          {type === 'payment' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-on-surface dark:text-gray-200 mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="$450.00"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface-container-lowest dark:bg-gray-800 text-on-surface dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-on-surface dark:text-gray-200 mb-1">
                  Vendor
                </label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="Acme Corp LLC"
                  className="w-full px-3 py-2 rounded-lg border border-outline-variant dark:border-gray-700 bg-surface-container-lowest dark:bg-gray-800 text-on-surface dark:text-gray-200"
                />
              </div>
            </div>
          )}

          <div className="pt-3 flex gap-2 justify-end border-t border-outline-variant/40 dark:border-gray-700 mt-4">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(action.id);
                  onClose();
                }}
                className="px-3 py-2 text-error hover:bg-error-container/20 rounded-lg text-[13px] font-semibold mr-auto"
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-outline-variant text-[13px] font-semibold text-on-surface dark:text-gray-300 hover:bg-surface-container"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-on-primary text-[13px] font-semibold hover:bg-blue-700 shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
