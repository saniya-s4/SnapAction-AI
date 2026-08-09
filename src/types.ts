export type TabType = 'upload' | 'history' | 'tasks' | 'settings';

export type AppState = 'idle' | 'processing' | 'results' | 'error';

export type ActionType = 'event' | 'delivery' | 'payment' | 'contact' | 'task' | 'general';

export interface ExtractedAction {
  id: string;
  type: ActionType;
  title: string;
  subtitle?: string;
  details: {
    // Event
    date?: string;
    time?: string;
    location?: string;
    // Delivery
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: string;
    deliveryStatus?: string;
    // Payment
    amount?: string;
    vendor?: string;
    dueDate?: string;
    description?: string;
    // Contact
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    role?: string;
    // Task
    priority?: 'high' | 'medium' | 'low';
  };
  primaryActionLabel?: string;
  statusBadge?: string; // e.g., "PROCESSED", "In Transit", "Due Soon", "Contact Added"
  completed?: boolean;
}

export interface ScanRecord {
  id: string;
  documentTitle: string;
  documentType: 'receipt' | 'whiteboard' | 'business_card' | 'invoice' | 'document' | 'other';
  summary: string;
  extractedItemsCount: number;
  extractedText?: string;
  timestamp: string;
  imageUrl: string;
  statusBadge: string; // e.g. "PROCESSED", "CONTACT ADDED", "FAILED"
  actions: ExtractedAction[];
}

export interface TaskFilterOptions {
  typeFilter: string;
  searchQuery: string;
  statusFilter: 'all' | 'pending' | 'completed';
}
