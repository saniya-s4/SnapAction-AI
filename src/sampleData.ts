import { ScanRecord } from './types';

export const INITIAL_RECENT_SCANS: ScanRecord[] = [
  {
    id: 'scan-1',
    documentTitle: 'Grocery Receipt',
    documentType: 'receipt',
    summary: "Extracted 15 items, total $142.30. Identified 'Whole Foods'.",
    extractedItemsCount: 15,
    timestamp: '2 hours ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEfg8K4Kl-VQOnDKgHdc5IKOFsfqXFQM4Y6Z7xiYqj4LLK6yxOaUFebwpxFQKmVxD9KlUewOSrMNnDlsZFFzHt1UCRLeAb0rdpfnMPyhKYgh9WAvbcjvvLf4w46NI5iIubiS2AIh4WI1sOsTl_XKBDoICs2vi5aSNbUtpWTapvRE8ecAkDQYP5z_wZt76gV1sJrIAFag7MfHR3VxOf2P5ATcQvKeTEEyNs8fCiM7rVaKDnav7oagUJwg',
    statusBadge: 'PROCESSED',
    actions: [
      {
        id: 'act-101',
        type: 'payment',
        title: '$142.30',
        subtitle: 'Whole Foods Market',
        details: {
          amount: '$142.30',
          vendor: 'Whole Foods Market',
          dueDate: 'Paid on Oct 24, 2023',
          description: '15 Grocery items (Organic Produce, Dairy, Bakery)',
        },
        primaryActionLabel: 'View Receipt Items',
        statusBadge: 'PAID',
        completed: true,
      },
      {
        id: 'act-102',
        type: 'task',
        title: 'Reimburse Grocery Expense',
        subtitle: 'Submit to company expense portal',
        details: {
          vendor: 'Whole Foods',
          amount: '$142.30',
          priority: 'medium',
        },
        primaryActionLabel: 'Mark Expense Submitted',
        statusBadge: 'PENDING',
        completed: false,
      }
    ]
  },
  {
    id: 'scan-2',
    documentTitle: 'Whiteboard Notes',
    documentType: 'whiteboard',
    summary: 'Generated 5 action items from Q3 planning session.',
    extractedItemsCount: 5,
    timestamp: 'Yesterday',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOOUactBO862sS8B4pTmSanFVxB6D0qtZwtibwtC9AYZR30QCzdyWv0Y-y3G_pnvItku-ycplmBAtRghfAmPAQgTqw1012Y78UvRNy64JzoB25dOOxwKCoj-jQkZAIIAyyIXM-NlVmRQHQNdthS-SKOR_BozFNrCOwXanYcP8QZHnyMOb2z31fpY--OsSjDA54UXUHp5GKV7183bFd9h8aphDPHls1Q0_e1JSF8FvbEqQ82wraoyKGSg',
    statusBadge: 'PROCESSED',
    actions: [
      {
        id: 'act-201',
        type: 'task',
        title: 'Refine NLP Model',
        subtitle: 'Assigned to Sarah',
        details: {
          dueDate: 'Nov 2, 2023',
          priority: 'high',
          description: 'Improve multi-token entity extraction accuracy',
        },
        primaryActionLabel: 'Assign Task',
        statusBadge: 'ACTION ITEM',
        completed: false,
      },
      {
        id: 'act-202',
        type: 'task',
        title: 'API Integration V3',
        subtitle: 'Assigned to David',
        details: {
          dueDate: 'Nov 9, 2023',
          priority: 'high',
        },
        primaryActionLabel: 'View Endpoint Specs',
        statusBadge: 'ACTION ITEM',
        completed: false,
      },
      {
        id: 'act-203',
        type: 'task',
        title: 'UI Upload Flow Redesign',
        subtitle: 'Assigned to Mike',
        details: {
          dueDate: 'Nov 5, 2023',
          priority: 'medium',
        },
        primaryActionLabel: 'Open Figma Design',
        statusBadge: 'ACTION ITEM',
        completed: false,
      }
    ]
  },
  {
    id: 'scan-3',
    documentTitle: 'Business Card',
    documentType: 'business_card',
    summary: "Added 'Jane Doe' to contacts. Identified email and phone.",
    extractedItemsCount: 1,
    timestamp: '2 Days ago',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL2Rs0Lpgee5QZ9LTgovYMm57v_mxA-U7ngx3V57y8ppB4qrnqhpL8u10a6IuQ9ufiqfLb5EkGQcfTuvRq3Bp_EI2F1KGCU6-SqmEkjBazxo_h_9WYdZf-UKnCcBae2Lnz8NQxlU3yyTgA0wshVg5mXXNVhpG206bA2odtYqj3uMW_9dz8XXkobdwIbsH0L8RgXZGTn3GIDSdklhnWuXtgk4xWqevgFXd67o3b69Srp9sFSLD_mFHD5w',
    statusBadge: 'CONTACT ADDED',
    actions: [
      {
        id: 'act-301',
        type: 'contact',
        title: 'Alex Chen',
        subtitle: 'Product Manager @ SnapAction AI',
        details: {
          name: 'Alex Chen',
          role: 'Product Manager',
          company: 'SnapAction AI',
          email: 'alex.chen@snapaction.ai',
          phone: '+1 415 555 0192',
        },
        primaryActionLabel: 'Save to Contacts',
        statusBadge: 'CONTACT ADDED',
        completed: true,
      }
    ]
  }
];

export const DEMO_RESULTS_SCAN: ScanRecord = {
  id: 'scan-demo-1',
  documentTitle: 'Desk Action Documents',
  documentType: 'document',
  summary: 'We found 3 actionable items from your image.',
  extractedItemsCount: 3,
  timestamp: 'Just now',
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGxTvg_cW97Bvo6hNvFkKTG6CDLf-mNkoL7ZvwTyjYqH80u5lU612RXKLApmbnND4FU4S-1kvsMv43Bt_vB1kCXYK-IBlzb2FvLeyEJw6ONaZQRfO0jgwghelVnRanm6mOUFJg-bZkWqFrBfI9rRrs6ka_YiEX0v9ifFwnxMFTSv2_9nyeXG7Na_FaeXrBPlpjQlhdCoF-nZ2oNMr1KY7AFGeoHnEdcgVx9hIJu6zTWaFrvNIZFCMqBw',
  statusBadge: 'PROCESSED',
  actions: [
    {
      id: 'act-demo-1',
      type: 'event',
      title: 'Design System Workshop',
      subtitle: 'Workshop Event',
      details: {
        date: 'Oct 24, 2023',
        time: '2:00 PM - 4:00 PM',
        location: 'Studio 4B, NY',
      },
      primaryActionLabel: 'Add to Calendar',
      statusBadge: 'EVENT',
      completed: false,
    },
    {
      id: 'act-demo-2',
      type: 'delivery',
      title: 'FedEx Priority Box',
      subtitle: 'FedEx Tracking',
      details: {
        trackingNumber: '1Z9999W99999999999',
        carrier: 'FedEx Ground',
        estimatedDelivery: 'Est: Tomorrow by 8PM',
        deliveryStatus: 'In Transit',
      },
      primaryActionLabel: 'Track Package',
      statusBadge: 'In Transit',
      completed: false,
    },
    {
      id: 'act-demo-3',
      type: 'payment',
      title: '$450.00',
      subtitle: 'Freelance Design Services',
      details: {
        amount: '$450.00',
        vendor: 'Acme Corp LLC',
        dueDate: 'Due: Oct 20, 2023',
        description: 'Freelance Design Services',
      },
      primaryActionLabel: 'Copy Details',
      statusBadge: 'Due Soon',
      completed: false,
    }
  ]
};
