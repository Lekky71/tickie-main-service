import { Document } from 'mongoose';

export enum ActivityStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface Asset extends Document {
  id: string;
  symbol: string;
  user: string;
  depositActivity: ActivityStatus;
  withdrawalActivity: ActivityStatus;
}

export interface FullAsset {
  id: string;
  symbol: string;
  user: string;
  network: string;
  depositActivity: ActivityStatus;
  withdrawalActivity: ActivityStatus;
  availableBalance: number,
  pendingBalance: number,
}
