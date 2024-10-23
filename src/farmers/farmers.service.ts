import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { farmers,TSFarmers,TIFarmers } from "../drizzle/schema";

export const farmerService = {
    //Get all farmers with optional int
    getAll:async (limit?: number): Promise<TSFarmers[]> =>{
        if(limit){
            return await db.query.farmers.findMany({
                limit:limit
            });
    }
    return await db.query.farmers.findMany();
    },

     // Get single farmer by id
  getById: async (id: number): Promise<TSFarmers | undefined> => {
    return await db.query.farmers.findFirst({
      where: eq(farmers.id, id),
    });
  },

    // Create new farmer
    create: async (data: Omit<TSFarmers, 'id'>): Promise<TSFarmers> => {
        const [newFarmer] = await db.insert(farmers).values(data).returning();
        return newFarmer;
      },
    

  //update a farmer
  update: async(id:number, data: Partial<TIFarmers>): Promise<TIFarmers | undefined> =>{
    const [updatedFarmer] = await db
    .update(farmers)
    .set(data)
    .where(eq(farmers.id,id))
    .returning();
return updatedFarmer;
  },

  // Delete farmer
  delete: async (id: number): Promise<TSFarmers | undefined> => {
    const [deletedFarmer] = await db
      .delete(farmers)
      .where(eq(farmers.id, id))
      .returning();
    return deletedFarmer;
  }

}
