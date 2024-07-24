import { heatmapRouter } from '$lib/routers/heatmap';
import { helloRouter } from './routers/hello.router';
import { createTRPCRouter } from './trpcContext';

export const appRouter = createTRPCRouter({
	hello: helloRouter,
	heatmap: heatmapRouter
});

export type AppRouter = typeof appRouter;
