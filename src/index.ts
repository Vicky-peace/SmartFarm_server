import {Hono} from  'hono';
import "dotenv/config";
import {serve} from '@hono/node-server';
import {cors} from 'hono/cors';
import {logger} from 'hono/logger';
import { errorHandler } from './middleware/error.middleware';

import { authRouter } from './auth/auth.router';
import {userRoutes} from './users/users.router';
import { farmersRouter } from './farmers/farmers.router';
import { buyerRouter } from './buyers/buyers.router';
import { productRouter } from './products/products.router';
import { listingRouter } from './listings/listings.routers';
import { orderRouter } from './orders/order.router';


const app = new Hono();

//Middleware
app.use('*', logger());
app.use('*', cors());

app.get('/', async(c) => {
    return c.json({message: 'Welcome to my API'});
})

//Error handler
app.onError(errorHandler);


app.route('/', authRouter)
app.route('/', userRoutes)
app.route('/', farmersRouter)
app.route('/', buyerRouter)
app.route('/', productRouter)
app.route('/', listingRouter)
app.route('/', orderRouter)

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT)
})

console.log(`Server is running on http://localhost:${process.env.PORT}`)