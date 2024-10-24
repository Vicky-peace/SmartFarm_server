import { Context } from "hono";
import { orderService } from "./orders.service";
import { createOrderSchema } from "../validators/validator";


export const orderController = {
    createOrder: async (c: Context) =>{
        try{
            const validateData = await createOrderSchema.parseAsync(await c.req.json());
            const order = await orderService.create(validateData);
    
            return c.json({
                success: true,
                data: order
            }, 201)
        } catch(error: any){
            console.error('Error creating order:', error);
            return c.json({
                success: false,
                error: error.message || 'Failed to create order'
            },400)
        }
       
    }
}