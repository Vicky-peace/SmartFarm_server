import { Context } from "hono";
import { registerUser, loginUser } from "./auth.service";
import { registerSchema, loginSchema } from "../validators/validator";
import { HTTPException } from "hono/http-exception";

export const register = async (c: Context) => {
  try {
    const data = await c.req.json();
    const validatedData = registerSchema.parse(data); // Validate request data
    const result = await registerUser(validatedData); // Call the function directly
    return c.json(result, 201);
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(400, { message: error.message }); // Handle validation or processing errors
    }
    throw error;
  }
};


export const login = async (c: Context) => {
    try {
      const data = await c.req.json();
      const validatedData = loginSchema.parse(data); // Validate request data
      const result = await loginUser(validatedData); // Call the function directly
      return c.json(result); // Return result with status 200 (OK)
    } catch (error) {
      if (error instanceof Error) {
        throw new HTTPException(400, { message: error.message }); // Handle validation or processing errors
      }
      throw error;
    }
  };