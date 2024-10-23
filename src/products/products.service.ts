import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { products, TSProducts, TIProducts } from "../drizzle/schema";

export const productService = {
  //get all products with optional limit
  getAll: async (limit?: number): Promise<TSProducts[]> => {
    if (limit) {
      return await db.query.products.findMany({
        limit: limit,
      });
    }
    return await db.query.products.findMany();
  },

  //get products by category
  getByCategory: async (category: string): Promise<TSProducts[]> => {
    return await db.query.products.findMany({
      where: eq(products.category, category),
    });
  },

  //get a single product by id
  getById: async (id: number): Promise<TSProducts | undefined> => {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
    });
  },

  //create a new product
  create: async (data: Omit<TIProducts, "id">): Promise<TIProducts> => {
    const [newProduct] = await db.insert(products).values(data).returning();
    return newProduct;
  },
  // Update product
  update: async (
    id: number,
    data: Partial<TIProducts>
  ): Promise<TIProducts | undefined> => {
    const [updatedProduct] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  },
  // Delete product
  delete: async (id: number): Promise<TSProducts | undefined> => {
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return deletedProduct;
  },
  // Search products by name
  searchByName: async (searchTerm: string): Promise<TSProducts[]> => {
    try {
      console.log("Search Term:", searchTerm);
      const products = await db.query.products.findMany({
        where: (products, { like }) => like(products.name, `%${searchTerm}%`),
      });
      console.log("Products found:", products); // Log the result
      return products;
    } catch (error) {
      console.error("Database search error:", error); // Log the specific database error
      throw new Error("Database query failed");
    }
  },
};
