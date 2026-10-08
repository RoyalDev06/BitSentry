import type { CaseDetail } from '../types/cases';

export const mockCases: CaseDetail[] = [
  {
    id: 'CASE-004',
    title: 'Rapid layering via 3 intermediate addresses',
    description:
      'Funds moved through three wallets in under 20 minutes with decreasing amounts, consistent with layering.',
    status: 'under_investigation',
    priority: 'critical',
    assignedTo: 'A. Kimani',
    createdAt: '2026-09-28T09:42:00Z',
    updatedAt: '2026-09-29T10:15:00Z',
    relatedAlerts: [
      { id: 'ALERT-004', indicator: 'Multiple-hop activity', riskLevel: 'critical', status: 'new', createdAt: '2026-09-29T09:42:00Z' },
      { id: 'ALERT-003', indicator: 'Rapid movement of funds', riskLevel: 'high', status: 'in_review', createdAt: '2026-09-29T09:15:00Z' },
    ],
    relatedTransactions: [
      { id: '1', txId: 'a1f3c9e27b4d8a10c5e6', amountBtc: 2.4501, riskLevel: 'critical', timestamp: '2026-09-29T09:42:00Z' },
      { id: '2', txId: '7be04d19a3c2f8e1b6d0', amountBtc: 0.8123, riskLevel: 'high', timestamp: '2026-09-29T09:15:00Z' },
      { id: '3', txId: 'c93a5e0f1d7b24a86e3c', amountBtc: 0.1204, riskLevel: 'medium', timestamp: '2026-09-29T08:57:00Z' },
    ],
    relatedAddresses: [
      { address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', label: 'Origin wallet', riskLevel: 'high', txCount: 14 },
      { address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', label: 'Intermediate', riskLevel: 'medium', txCount: 6 },
    ],
    notes: [
      { id: 'n1', author: 'A. Kimani', body: 'Linked to earlier structuring case. Escalating priority.', createdAt: '2026-09-29T10:15:00Z' },
    ],
  },
  {
    id: 'CASE-003',
    title: 'Peel chain through exchange deposit address',
    description: 'Classic peel chain pattern terminating at a known exchange deposit address.',
    status: 'escalated',
    priority: 'high',
    assignedTo: 'A. Kimani',
    createdAt: '2026-09-27T14:20:00Z',
    updatedAt: '2026-09-28T16:05:00Z',
    relatedAlerts: [
      { id: 'ALERT-001', indicator: 'Simple peel-chain indicator', riskLevel: 'high', status: 'escalated', createdAt: '2026-09-28T17:05:00Z' },
    ],
    relatedTransactions: [
      { id: '4', txId: '2d8e6b41f0a97c35d1e8', amountBtc: 0.0345, riskLevel: 'low', timestamp: '2026-09-29T08:30:00Z' },
    ],
    relatedAddresses: [
      { address: 'bc1qzx5n3r4tjv3jks4g2p4d8v7xfq5g8k2ynlz9xq', label: 'Peel source', riskLevel: 'high', txCount: 22 },
    ],
    notes: [
      { id: 'n2', author: 'A. Kimani', body: 'Waiting on exchange KYC response.', createdAt: '2026-09-28T16:05:00Z' },
    ],
  },
  {
    id: 'CASE-002',
    title: 'High-frequency small transfers, possible structuring',
    description: 'Analyst flagged pattern of sub-threshold transfers over 48 hours.',
    status: 'open',
    priority: 'medium',
    assignedTo: null,
    createdAt: '2026-09-26T08:10:00Z',
    updatedAt: '2026-09-26T08:10:00Z',
    relatedAlerts: [
      { id: 'ALERT-002', indicator: 'High transaction frequency', riskLevel: 'medium', status: 'new', createdAt: '2026-09-29T08:20:00Z' },
    ],
    relatedTransactions: [],
    relatedAddresses: [],
    notes: [],
  },
  {
    id: 'CASE-001',
    title: 'Cleared after source-of-funds review',
    description: 'Source-of-funds documentation provided and verified.',
    status: 'closed',
    priority: 'low',
    assignedTo: 'J. Otieno',
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-25T09:30:00Z',
    relatedAlerts: [],
    relatedTransactions: [],
    relatedAddresses: [],
    notes: [
      { id: 'n3', author: 'J. Otieno', body: 'SOF documentation received and verified. Closing.', createdAt: '2026-09-25T09:30:00Z' },
    ],
  },
];