import { CreateProfileSchema, Profile } from "@repo/db/schema";
import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc.ts";

export const authRouter = {
	signUp: publicProcedure
		.input(CreateProfileSchema)
		.mutation(({ ctx, input }) =>
			ctx.db.insert(Profile).values(input).returning(),
		),
} satisfies TRPCRouterRecord;
