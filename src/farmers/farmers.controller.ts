import { Context } from "hono";
import { farmerService } from "./farmers.service";

export const farmerController = {
    //get all
  getAll: async (c: Context) => {
    try {
      const limit = c.req.query("limit")
        ? parseInt(c.req.query("limit")!)
        : undefined;
      const farmers = await farmerService.getAll(limit);
      return c.json({ success: true, data: farmers });
    } catch (error) {
      return c.json({ success: false, error: "Failed to fetch farmers" }, 500);
    }
  },
  //get by id
  getById: async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id'));
      const farmer = await farmerService.getById(id);
      if (!farmer) {
        return c.json({ success: false, error: 'Farmer not found' }, 404);
      }
      return c.json({ success: true, data: farmer });
    } catch (error) {
      return c.json({ success: false, error: 'Failed to fetch farmer' }, 500);
    }
},

//create farmer
create: async (c: Context) => {
    try {
      const data = await c.req.json();
      const newFarmer = await farmerService.create(data);
      return c.json({ success: true, data: newFarmer }, 201);
    } catch (error) {
      return c.json({ success: false, error: 'Failed to create farmer' }, 500);
    }
  },

  update: async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id'));
      const data = await c.req.json();
      const updatedFarmer = await farmerService.update(id, data);
      if (!updatedFarmer) {
        return c.json({ success: false, error: 'Farmer not found' }, 404);
      }
      return c.json({ success: true, data: updatedFarmer });
    } catch (error) {
      return c.json({ success: false, error: 'Failed to update farmer' }, 500);
    }
  },

  delete: async (c: Context) => {
    try {
        const id = parseInt(c.req.param('id'));
        const deletedFarmer = await farmerService.delete(id);
        if(!deletedFarmer){
            return c.json({success: false, error: 'Framer not found'}, 404);
        }
        return c.json({success: true, data:deletedFarmer});
    } catch (error) {
        return c.json({ success: false, error: 'Failed to delete farmer' }, 500);
    }
  }

};
