import { db } from "@repo/db/client";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export async function createTRPCContext() {
	return { db };
}

export const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
