import { authRouter } from "./routers/auth.ts";
import { postRouter } from "./routers/post.ts";
import { createTRPCRouter } from "./trpc.ts";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	post: postRouter,
});

export type AppRouter = typeof appRouter;
