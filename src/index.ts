import {Hono} from  'hono';
import "dotenv/config";
import {serve} from '@hono/node-server';
import {cors} from 'hono/cors';
import {logger} from 'hono/logger';
import { errorHandler } from './middleware/error.middleware';

import { authRouter } from './auth/auth.router';


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

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT)
})

console.log(`Server is running on http://localhost:${process.env.PORT}`)