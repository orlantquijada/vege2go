import { asc, eq } from "@repo/db";
import { CreatePostSchema, Post } from "@repo/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4-mini";

import { t } from "../trpc.ts";

export const postRouter = {
	all: t.procedure.query(({ ctx }) =>
		ctx.db.query.Post.findMany({ orderBy: asc(Post.createdAt) }),
	),
	create: t.procedure
		.input(CreatePostSchema)
		.mutation(({ ctx, input }) =>
			ctx.db.insert(Post).values(input).returning(),
		),
	id: t.procedure.input(z.string()).query(({ ctx, input }) =>
		ctx.db.query.Post.findFirst({
			where: eq(Post.id, input),
		}),
	),
} satisfies TRPCRouterRecord;
