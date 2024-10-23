import {eq, and , gte, sql,lte} from 'drizzle-orm'
import { db } from '../drizzle/db'
import { listings, farmers,products,TSListings, TIListings} from '../drizzle/schema';


export const listingService = {
   //Get all listings with optional limit aand relations
  // Get all listings with optional limit
  getAll: async (limit?: number): Promise<TSListings[]> => {
    try {
      if (limit) {
        return await db.query.listings.findMany({
          limit: limit,
          with: {
            farmer: true,
            product: true,
          },
        });
      }
      return await db.query.listings.findMany({
        with: {
          farmer: true,
          product: true,
        },
      });
    } catch (error) {
      console.error("Error fetching all listings:", error);
      throw new Error("Failed to fetch listings");
    }
  },

  //Getactive listings only
  getActive: async (): Promise<TSListings[]> => {
    try {
        return await db.query.listings.findMany({
            where: and(
                eq(listings.status, 'active'),
                gte(listings.availableDate, new Date())
            ),
            with:{
                farmer: true,
                product: true,
            },
        });
    } catch (error) {
        console.error("Error fetching active listings:", error);
        throw new Error("Failed to fetch active listings");
    }
  },

  //Get Listings by farmer ID
  getByFarmerId: async (farmerId: number): Promise<TSListings[]> => {
    try {
        return await db.query.listings.findMany({
            where: eq(listings.farmerId, farmerId),
            with:{
                product: true,
            },
        });
    } catch (error) {
        console.error(`Error fetching listings for farmer ${farmerId}:`, error);
        throw new Error("Failed to fetch farmer listings");
    }
  },
   // Get listings by product ID
   getByProductId: async (productId: number): Promise<TSListings[]> => {
    try {
      return await db.query.listings.findMany({
        where: eq(listings.productId, productId),
        with: {
          farmer: true,
        },
      });
    } catch (error) {
      console.error(`Error fetching listings for product ${productId}:`, error);
      throw new Error("Failed to fetch product listings");
    }
  },
   // Get single listing by ID
   getById: async (id: number): Promise<TSListings | undefined> => {
    try {
      return await db.query.listings.findFirst({
        where: eq(listings.id, id),
        with: {
          farmer: true,
          product: true,
        },
      });
    } catch (error) {
      console.error(`Error fetching listing ${id}:`, error);
      throw new Error("Failed to fetch listing");
    }
  },
  // Create new listing
  create: async (data: Omit<TIListings, "id" | "createdAt" | "updatedAt">): Promise<TIListings> => {
    try {
      const [newListing] = await db.insert(listings)
        .values({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return newListing;
    } catch (error) {
      console.error("Error creating listing:", error);
      throw new Error("Failed to create listing");
    }
  },
   // Update listing
   update: async (id: number, data: Partial<TIListings>): Promise<TIListings | undefined> => {
    try {
      const [updatedListing] = await db
        .update(listings)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(listings.id, id))
        .returning();
      return updatedListing;
    } catch (error) {
      console.error(`Error updating listing ${id}:`, error);
      throw new Error("Failed to update listing");
    }
  },
   // Update listing status
   updateStatus: async (id: number, status: 'active' | 'sold' | 'expired'): Promise<TIListings | undefined> => {
    try {
      const [updatedListing] = await db
        .update(listings)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(listings.id, id))
        .returning();
      return updatedListing;
    } catch (error) {
      console.error(`Error updating status for listing ${id}:`, error);
      throw new Error("Failed to update listing status");
    }
  },
   // Delete listing
   delete: async (id: number): Promise<TSListings | undefined> => {
    try {
      const [deletedListing] = await db
        .delete(listings)
        .where(eq(listings.id, id))
        .returning();
      return deletedListing;
    } catch (error) {
      console.error(`Error deleting listing ${id}:`, error);
      throw new Error("Failed to delete listing");
    }
  },
    // Search listings by price range
    searchByPriceRange: async (minPrice: number, maxPrice: number): Promise<TSListings[]> => {
        try {
          return await db.query.listings.findMany({
            where: and(
              gte(listings.price, minPrice.toString()),
              lte(listings.price, maxPrice.toString()),
              eq(listings.status, 'active')
            ),
            with: {
              farmer: true,
              product: true,
            },
          });
        } catch (error) {
          console.error(`Error searching listings in price range ${minPrice}-${maxPrice}:`, error);
          throw new Error("Failed to search listings by price");
        }
      },
}
