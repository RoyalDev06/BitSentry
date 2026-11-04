export interface MonitoredWallet {
  id: number;
  name: string;
  address: string;
  label?: string | null;
  created_at?: string;
}

export interface CreateWalletRequest {
  name: string;
  address: string;
  label?: string;
}
