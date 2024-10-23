import { Hono } from "hono";
import { farmerController } from "./farmers.controller";
import { farmerSchema } from "../validators/validator";
import { zValidator } from "@hono/zod-validator";

export const farmersRouter =  new Hono();

farmersRouter.get('/farmers', farmerController.getAll);
farmersRouter.get('/farmers/:id', farmerController.getById);
farmersRouter.post('/farmers', zValidator('json', farmerSchema) ,farmerController.create);
farmersRouter.put('/farmers/:id', zValidator('json', farmerSchema), farmerController.update);
farmersRouter.delete('/farmers/:id', farmerController.delete);