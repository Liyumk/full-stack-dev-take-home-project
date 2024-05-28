import { helloRouter } from './routers/hello.router';
import { createTRPCRouter } from './trpcContext';

export const appRouter = createTRPCRouter({
	hello: helloRouter
});

export type AppRouter = typeof appRouter;
