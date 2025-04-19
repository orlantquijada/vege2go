import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import type { createTRPCContext } from "./context.ts";

export const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

const isAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.auth?.userId) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Not authenticated",
		});
	}

	return next({
		ctx: {
			auth: ctx.auth,
		},
	});
});

const procedure = t.procedure;

export const publicProcedure = procedure;
export const protectedProcedure = procedure.use(isAuthed);
