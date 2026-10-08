export type AddressRisk = "low" | "medium" | "high" | "critical";

export type BitcoinAddress = {
  id: string;
  address: string;
  network: "bitcoin";
  balance: number;
  transactionCount: number;
  risk: AddressRisk;
  firstSeen: string;
  lastActivity: string;
};