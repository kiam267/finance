import { Hono } from 'hono';
// import { HTTPException } from 'hono/http-exception';
import { handle } from 'hono/vercel';
import { z } from 'zod'; 
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import accounts from './accounts';
export const runtime = 'edge';

const app = new Hono().basePath('/api');
// app.use();

// app.onError((err, c) => {
//     if (err instanceof HTTPException) {
//         return err.getResponse();
//     }
//     return c.json({ error: 'Internal Server Error' }, 500);
// });

const route = app.route('/accounts', accounts);

app.get('/health', clerkMiddleware(), (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) {
        return c.json({
            error: 'unauthorized',
        });
    }

    return c.json({
        status: 'ok',
    });
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof route;
