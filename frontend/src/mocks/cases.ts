import type { Case } from '../types/cases';

export const mockCases: Case[] = [
  {
    id: 'CASE-004',
    title: 'Rapid layering via 3 intermediate addresses',
    status: 'in_review',
    priority: 'critical',
    alertCount: 4,
    assignedTo: 'A. Kimani',
    createdAt: '2026-09-28T09:42:00Z',
    updatedAt: '2026-09-29T10:15:00Z',
  },
  {
    id: 'CASE-003',
    title: 'Peel chain through exchange deposit address',
    status: 'escalated',
    priority: 'high',
    alertCount: 2,
    assignedTo: 'A. Kimani',
    createdAt: '2026-09-27T14:20:00Z',
    updatedAt: '2026-09-28T16:05:00Z',
  },
  {
    id: 'CASE-002',
    title: 'High-frequency small transfers, possible structuring',
    status: 'open',
    priority: 'medium',
    alertCount: 1,
    assignedTo: null,
    createdAt: '2026-09-26T08:10:00Z',
    updatedAt: '2026-09-26T08:10:00Z',
  },
  {
    id: 'CASE-001',
    title: 'Cleared after source-of-funds review',
    status: 'closed',
    priority: 'low',
    alertCount: 1,
    assignedTo: 'J. Otieno',
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-25T09:30:00Z',
  },
];