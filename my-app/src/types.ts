// types.ts
export type UserType = 'guest' | 'host' | 'admin';

export interface Car {
  id: number;
  brand: string;
  model: string;
  color:String;
  owner: String;
  year: number;
  image: string;
  status: string;
  totalRentals: number;
  totalUsageDays: number;
  pricePerDay: number;
  description?: string;
  features?: string[];
}