import { desc } from "@repo/db";
import { Users } from "@repo/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import * as v from "valibot";
import { t } from "../trpc.ts";

export const usersRouter = {
	all: t.procedure.query(({ ctx }) =>
		ctx.db.query.Users.findMany({ orderBy: desc(Users.id) }),
	),
	createUser: t.procedure
		.input(
			v.object({
				age: v.number(),
				name: v.string(),
			}),
		)
		.mutation(({ ctx, input }) => ctx.db.insert(Users).values(input)),
} satisfies TRPCRouterRecord;
