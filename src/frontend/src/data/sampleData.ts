import type { RabbitStatus, Rarity } from "../backend";

export interface SamplePet {
  id: string;
  name: string;
  birthDate: string;
  materials: string;
  rarity: Rarity;
  status: RabbitStatus;
  owner?: string;
  price?: number;
  auctionEnds?: Date;
  currentBid?: number;
  image?: string;
  description?: string;
  likes: number;
  series?: string;
  year?: string;
  character?: string;
  collectionNumber?: string;
}

// Keep SampleRabbit as alias for backward compat
export type SampleRabbit = SamplePet;

export interface SampleCollector {
  id: string;
  nickname: string;
  city: string;
  rabbitsCollected: number;
  avatar?: string;
  joinDate: string;
  achievements: string[];
}

export interface BidEntry {
  bidder: string;
  amount: number;
  timestamp: string;
}

export const sampleRabbits: SamplePet[] = [];

export const sampleCollectors: SampleCollector[] = [];

export const sampleBids: Record<string, BidEntry[]> = {};
