export interface Rental {
  rentalId: number;
  tenant: string;
  startDate: string; // Formato 'YYYY-MM-DD'
  endDate: string;   // Formato 'YYYY-MM-DD'
  price: number;
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  color: string;
  owner: string;
  year: number;
  image: string;
  status: string;
  totalRentals: number;
  totalUsageDays: number;
  pricePerDay: number;
  description?: string;
  features?: string[];
  topRank:number;
  rentals?: Rental[]; // Agregado para almacenar las rentas del automóvil
}
