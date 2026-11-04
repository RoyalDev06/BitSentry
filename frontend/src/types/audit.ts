export interface AuditEntry {
  id: number;
  actor_id: number;
  action: string;
  target_type: string;
  target_id?: number | null;
  details?: Record<string, unknown> | null;
  created_at: string;
}
