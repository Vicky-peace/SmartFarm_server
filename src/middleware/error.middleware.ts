import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

export async function errorHandler(err: Error, c: Context) {
  // Handle validation errors (ZodError)
  if (err instanceof ZodError) {
    return c.json({
      success: false,
      message: err.message,
    }, 400);
  }

  // Handle HTTP exceptions (HTTPException)
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      message: err.message,
    }, err.status);
  }

  // Default error handler for any other errors
  console.error(err); // Log the error for debugging
  return c.json({
    success: false,
    message: 'Internal server error',
  }, 500);
}
