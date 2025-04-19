import { getAuth } from "@clerk/fastify";
import { db } from "@repo/db/client";
import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export type Session = ReturnType<typeof getAuth>;

type CreateContextOptions = {
	auth: Session | null;
};

export function createContextInner(opts: CreateContextOptions) {
	return {
		db,
		auth: opts.auth,
	};
}

export async function createTRPCContext(opts: CreateFastifyContextOptions) {
	return createContextInner({ auth: getAuth(opts.req) });
}
