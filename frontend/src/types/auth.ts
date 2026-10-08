export interface CurrentUser {
  id: number;
  email: string;
  full_name: string;
  roles: string[];
  is_active: boolean;
}

export interface BitcoinStatus {
  connected: boolean;
  network?: string;
  blocks?: number;
  headers?: number;
  verification_progress?: number;
  error?: string;
}
