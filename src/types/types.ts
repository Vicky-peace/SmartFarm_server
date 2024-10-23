export interface TSListings {
    id: number;
    farmerId: number;
    productId: number;
    quantity: number;
    price: number;
    availableDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    farmer?: {
      id: number;
      userId: number;
      location: string;
      farmSize: number | null;
      primaryCrops: string | null;
    };
    product?: {
      id: number;
      name: string;
      category: string;
      unit: string;
    };
  }