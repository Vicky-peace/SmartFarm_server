import {Hono} from  'hono';
import "dotenv/config";
import {serve} from '@hono/node-server';
import {cors} from 'hono/cors';


const app = new Hono();

app.get('/', async(c) => {
    return c.json({message: 'Welcome to my API'});
})

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT)
})

console.log(`Server is running on http://localhost:${process.env.PORT}`)