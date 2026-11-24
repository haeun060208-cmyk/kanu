export interface CapsuleItem {
  id: string;
  nameKo: string;
  nameEn: string;
  intensity: number; // 1 to 12
  roastCategory: 'light' | 'medium' | 'dark' | 'decaf';
  description: string;
  tastingNotes: string[];
  acidity: number; // 1 to 5
  body: number; // 1 to 5
  roastLevel: number; // 1 to 5
  aromaScore: number; // 1 to 5
  recommendedCup: 'Espresso (25ml)' | 'Lungo (40ml)' | 'Americano (130ml)';
  price: number; // in KRW (e.g. 7900 for 8 capsules)
  capsuleCount: number;
  colorHex: string; // 3D capsule body color
  accentHex: string; // 3D foil accent color
  badgeText?: string;
}

export interface CartItem {
  capsule: CapsuleItem;
  quantity: number;
}
