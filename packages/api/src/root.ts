import { postRouter } from "./routers/post.ts";
import { usersRouter } from "./routers/users.ts";
import { createTRPCRouter } from "./trpc.ts";

export const appRouter = createTRPCRouter({
	post: postRouter,
	users: usersRouter,
});

export type AppRouter = typeof appRouter;
