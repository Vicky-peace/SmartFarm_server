import { Context } from "hono";
import { listingService } from "./listings.services";

export const listingController = {
  getAll: async (c: Context) => {
    try {
      const limit = c.req.query("limit")
        ? parseInt(c.req.query("limit")!)
        : undefined;
      const listings = await listingService.getAll(limit);
      return c.json({ success: true, data: listings });
    } catch (error) {
      console.error("Controller error in getAll:", error);
      return c.json(
        {
          success: false,
          error: "Failed to fetch listings",
        },
        500
      );
    }
  },

  getActive: async (c: Context) => {
    try {
      const listings = await listingService.getActive();
      return c.json({ success: true, data: listings });
    } catch (error) {
      console.error("Controller error in getActive:", error);
      return c.json(
        {
          success: false,
          error: "Failed to fetch active listings",
        },
        500
      );
    }
  },

  getById: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const listing = await listingService.getById(id);

      if (!listing) {
        return c.json(
          {
            success: false,
            error: "Listing not found",
          },
          404
        );
      }
      return c.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      console.error(error);
      return c.json(
        {
          success: false,
          error: "Failed to fetch listing",
        },
        500
      );
    }
  },

  create: async (c: Context) => {
    try {
      const validatedData = await c.req.json();

      if (validatedData.availableDate) {
        validatedData.availableDate = new Date(validatedData.availableDate);
      }
      const newListing = await listingService.create(validatedData);

      return c.json(
        {
          success: true,
          data: newListing,
        },
        201
      );
    } catch (error) {
      console.error("Controller error in create:", error);
      return c.json(
        {
          success: false,
          error: "Failed to create listing",
        },
        500
      );
    }
  },

  update: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const listing = await c.req.json()

      if (listing.availableDate) {
        listing.availableDate = new Date(listing.availableDate);
      }
      const updatedListing = await listingService.update(
        id,
        await c.req.json()
      );

      if (!updatedListing) {
        return c.json(
          {
            success: false,
            error: "Listing not found",
          },
          404
        );
      }

      return c.json({
        success: true,
        data: updatedListing,
      });
    } catch (error) {
      console.error(
        `Controller error in update for ID ${c.req.param("id")}:`,
        error
      );
      return c.json(
        {
          success: false,
          error: "Failed to update listing",
        },
        500
      );
    }
  },

  updateStatus: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const body = await c.req.json();
      const status = body.status;

      if (!["active", "sold", "expired"].includes(status)) {
        return c.json(
          {
            success: false,
            error: "Invalid status value",
          },
          400
        );
      }

      const updatedListing = await listingService.updateStatus(id, status);

      if (!updatedListing) {
        return c.json(
          {
            success: false,
            error: "Listing not found",
          },
          404
        );
      }

      return c.json({
        success: true,
        data: updatedListing,
      });
    } catch (error) {
      console.error(
        `Controller error in updateStatus for ID ${c.req.param("id")}:`,
        error
      );

      return c.json(
        {
          success: false,
          error: "Failed to update listing status",
        },
        500
      );
    }
  },

  deleteListing: async (c: Context) => {
    try {
      const id = parseInt(c.req.param("id"));
      const deletedListing = await listingService.delete(id);

      if (!deletedListing) {
        return c.json(
          {
            success: false,
            error: "Listing not found",
          },
          404
        );
      }

      return c.json({
        success: true,
        data: deletedListing,
      });
    } catch (error) {
      console.error(
        `Controller error in delete for ID ${c.req.param("id")}:`,
        error
      );

      return c.json(
        {
          success: false,
          error: "Failed to delete listing",
        },
        500
      );
    }
  },
  searchByPriceRange: async (c: Context) => {
    try {
      const minPriceQuery = c.req.query("minPrice");
      const maxPriceQuery = c.req.query("maxPrice");

      if (!minPriceQuery || !maxPriceQuery) {
        return c.json(
          {
            success: false,
            error: "Price range parameters are required",
          },
          400
        );
      }

      const minPrice = parseFloat(minPriceQuery);
      const maxPrice = parseFloat(maxPriceQuery);

      if (isNaN(minPrice) || isNaN(maxPrice)) {
        return c.json(
          {
            success: false,
            error: "Invalid price range parameters",
          },
          400
        );
      }

      const listings = await listingService.searchByPriceRange(
        minPrice,
        maxPrice
      );
      return c.json({
        success: true,
        data: listings,
      });
    } catch (error) {
      console.error("Controller error in searchByPriceRange:", error);
      return c.json(
        {
          success: false,
          error: "Failed to search listings",
        },
        500
      );
    }
  },
};
