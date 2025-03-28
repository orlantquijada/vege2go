import {
	type NodePgDatabase,
	drizzle as pgDrizzle,
} from "drizzle-orm/node-postgres";
import * as schema from "./schema.ts";

import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";

export const db =
	process.env.NODE_ENV === "development"
		? pgDrizzle({
				connection: {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					connectionString: process.env.DATABASE_URL!,
				},
				schema,
				casing: "snake_case",
			})
		: (neonDrizzle({
				client: neon(
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					process.env.DATABASE_URL!,
				),
				schema,
				casing: "snake_case",
			}) as unknown as NodePgDatabase<typeof schema>);
