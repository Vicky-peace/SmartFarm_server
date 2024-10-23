import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { buyers } from "../drizzle/schema";
import { TIBuyers,TSBuyers } from "../drizzle/schema";

export const buyerService = {
    //get all buyers with optional limit
    getAll: async(limit?: number): Promise<TSBuyers[]> => {
        if(limit){
            return await db.query.buyers.findMany({
                limit: limit
            });
        }
  return await db.query.buyers.findMany()
    },

     // Get single buyer by id
  getById: async (id: number): Promise<TSBuyers | undefined> => {
    return await db.query.buyers.findFirst({
      where: eq(buyers.id, id),
    });
  },
// Create new buyer
create: async (data: Omit<TSBuyers, 'id'>): Promise<TSBuyers> => {
    const [newBuyer] = await db.insert(buyers).values(data).returning();
    return newBuyer;
  },

   // Update buyer
   update: async (id: number, data: Partial<TSBuyers>): Promise<TSBuyers | undefined> => {
    const [updatedBuyer] = await db
      .update(buyers)
      .set(data)
      .where(eq(buyers.id, id))
      .returning();
    return updatedBuyer;
  },

   // Delete buyer
   delete: async (id: number): Promise<TSBuyers | undefined> => {
    const [deletedBuyer] = await db
      .delete(buyers)
      .where(eq(buyers.id, id))
      .returning();
    return deletedBuyer;
  }
};
