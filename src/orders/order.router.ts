import { Hono } from "hono";
import { orderController } from "./order.controller";

export const orderRouter = new Hono();

orderRouter.post('/orders', orderController.createOrder)