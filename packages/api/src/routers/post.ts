import { asc, eq } from "@repo/db";
import { CreatePostSchema, Post } from "@repo/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import * as v from "valibot";

import { t } from "../trpc.ts";

export const postRouter = {
	all: t.procedure.query(({ ctx }) =>
		ctx.db.query.Post.findMany({ orderBy: asc(Post.createdAt) }),
	),
	create: t.procedure
		.input(CreatePostSchema)
		.mutation(({ ctx, input }) => ctx.db.insert(Post).values(input)),
	id: t.procedure.input(v.string()).query(({ ctx, input }) =>
		ctx.db.query.Post.findFirst({
			where: eq(Post.id, input),
		}),
	),
} satisfies TRPCRouterRecord;
