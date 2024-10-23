import { Hono } from "hono";
import { buyerController } from "./buyers.controller";

export const buyerRouter = new Hono();


// Buyer routes
buyerRouter.get('/buyers', buyerController.getAll);
buyerRouter.get('/buyers/:id', buyerController.getById);
buyerRouter.post('/buyers', buyerController.create);
buyerRouter.put('/buyers/:id', buyerController.update);
buyerRouter.delete('/buyers/:id', buyerController.delete);