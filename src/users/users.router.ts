import { Hono } from "hono";
import { getUserController,listUsersController,updateUserController,deleteUserController } from "./users.controller";


export const userRoutes = new Hono();

//Protected routes
userRoutes.get('/users', listUsersController);
userRoutes.get('/users/:id', getUserController);
userRoutes.put('/users/:id',updateUserController);
userRoutes.delete('/users/:id', deleteUserController);

