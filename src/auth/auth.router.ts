import { Hono } from "hono";
import { login,register } from "./auth.controller";
import {zValidator} from "@hono/zod-validator";
import { registerSchema,loginSchema } from "../validators/validator";

export const authRouter = new Hono();

authRouter.post('/register', zValidator('json', registerSchema), register)
authRouter.post('/login',zValidator('json', loginSchema), login)
