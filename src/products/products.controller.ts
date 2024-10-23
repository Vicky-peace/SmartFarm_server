import { Context } from "hono";
import { productService } from "./products.service";

export const productController = {
  getAll: async (c: Context) => {
    try {
      const limit = c.req.query("limit")
        ? parseInt(c.req.query("limit")!)
        : undefined;
      const products = await productService.getAll(limit);
      return c.json({ success: true, data: products });
    } catch (error) {
      return c.json({ success: false, error: "Failed to fetch products" }, 500);
    }
  },
  getByCategory: async (c: Context) => {
    try {
      const category = c.req.param("category");
      const products = await productService.getByCategory(category);
      return c.json({ success: true, data: products });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to fetch products by category" },
        500
      );
    }
  },
  getById: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const product = await productService.getById(id);
      if (!product) {
        return c.json({ success: false, error: "Product not found" }, 404);
      }
      return c.json({ success: true, data: product });
    } catch (error) {
      return c.json({ success: false, error: "Failed to fetch product" }, 500);
    }
  },
  create: async (c: Context) => {
    try {
      const data = await c.req.json();
      // Validate required fields
      if (!data.name || !data.category || !data.unit) {
        return c.json(
          {
            success: false,
            error: "Name, category, and unit are required fields",
          },
          400
        );
      }
      const newProduct = await productService.create(data);
      return c.json({ success: true, data: newProduct }, 201);
    } catch (error) {
      return c.json({ success: false, error: "Failed to create product" }, 500);
    }
  },
  update: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const data = await c.req.json();
      const updatedProduct = await productService.update(id, data);
      if (!updatedProduct) {
        return c.json({ success: false, error: "Product not found" }, 404);
      }
      return c.json({ success: true, data: updatedProduct });
    } catch (error) {
      return c.json({ success: false, error: "Failed to update product" }, 500);
    }
  },
  delete: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const deletedProduct = await productService.delete(id);
      if (!deletedProduct) {
        return c.json({ success: false, error: "Product not found" }, 404);
      }
      return c.json({ success: true, data: deletedProduct });
    } catch (error) {
      return c.json({ success: false, error: "Failed to delete product" }, 500);
    }
  },
  search: async (c: Context) => {
    try {
      const searchTerm = c.req.query("q");
      if (!searchTerm) {
        return c.json(
          { success: false, error: "Search term is required" },
          400
        );
      }
      const products = await productService.searchByName(searchTerm);
      return c.json({ success: true, data: products });
    } catch (error) {
        console.error("Error occurred while fetching products:", error);
      return c.json(
        { success: false, error: "Failed to search products" },
        500
      );
    }
  },
};
