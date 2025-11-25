export enum ItemType {
  INCENSE = 'INCENSE',
  CANDLE = 'CANDLE',
  TRIBUTE = 'TRIBUTE',
}

export interface Tier {
  price: number;
  label: string;
  effectLevel: number; // 1 = basic, 5 = godlike
  description: string;
}

export interface Deity {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  type: 'wealth' | 'health' | 'love' | 'career';
}

export interface OfferingState {
  incenseTier: Tier;
  candleTier: Tier;
  tributeTier: Tier;
}

export interface GeminiResponse {
  prediction: string;
  guidance: string;
  luckyNumber: number;
}
