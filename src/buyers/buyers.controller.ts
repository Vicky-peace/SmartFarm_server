
// controllers/buyerController.ts
import { Context } from 'hono';
import { buyerService } from './buyers.service';

export const buyerController = {
  getAll: async (c: Context) => {
    try {
      const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;
      const buyers = await buyerService.getAll(limit);
      return c.json({ success: true, data: buyers });
    } catch (error) {
      return c.json({ success: false, error: 'Failed to fetch buyers' }, 500);
    }
  },

  getById: async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id'));
      const buyer = await buyerService.getById(id);
      if (!buyer) {
        return c.json({ success: false, error: 'Buyer not found' }, 404);
      }
      return c.json({ success: true, data: buyer });
    } catch (error) {
      return c.json({ success: false, error: 'Failed to fetch buyer' }, 500);
    }
  },

  create: async (c: Context) => {
    try {
      const data = await c.req.json();
      const newBuyer = await buyerService.create(data);
      return c.json({ success: true, data: newBuyer }, 201);
    } catch (error) {
      return c.json({ success: false, error: 'Failed to create buyer' }, 500);
    }
  },

  update: async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id'));
      const data = await c.req.json();
      const updatedBuyer = await buyerService.update(id, data);
      if (!updatedBuyer) {
        return c.json({ success: false, error: 'Buyer not found' }, 404);
      }
      return c.json({ success: true, data: updatedBuyer });
    } catch (error) {
      return c.json({ success: false, error: 'Failed to update buyer' }, 500);
    }
  },

  delete: async (c: Context) => {
    try {
      const id = parseInt(c.req.param('id'));
      const deletedBuyer = await buyerService.delete(id);
      if (!deletedBuyer) {
        return c.json({ success: false, error: 'Buyer not found' }, 404);
      }
      return c.json({ success: true, data: deletedBuyer });
    } catch (error) {
      return c.json({ success: false, error: 'Failed to delete buyer' }, 500);
    }
  }
};