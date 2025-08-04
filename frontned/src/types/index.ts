export interface User {
  id: string;
  name: string;
  sex: string;
  phone: string;
  email: string;
  address: string;
  role: 'user';
}

export interface Shopkeeper {
  id: string;
  name: string;
  shopName: string;
  shopAddress: string;
  phone: string;
  shopPhoto?: string;
  description: string;
  rating: number;
  totalRatings: number;
  role: 'shopkeeper';
  wasteTypes: string[];
}

export interface WasteAnalysis {
  type: string;
  harmLevel: 'Low' | 'Medium' | 'High';
  confidence: number;
  recommendations: string[];
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}