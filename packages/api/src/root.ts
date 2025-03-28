import { postRouter } from "./routers/post.ts";
import { createTRPCRouter } from "./trpc.ts";

export const appRouter = createTRPCRouter({
	post: postRouter,
});

export type AppRouter = typeof appRouter;
const routerKeys = Object.keys(appRouter._def.procedures);
