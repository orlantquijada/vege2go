import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";

import * as schema from "./schema.ts";
import { connectionString } from "./url.ts";

if (process.env.NODE_ENV === "development") {
	neonConfig.fetchEndpoint = (host) => {
		const [protocol, port] =
			host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
		return `${protocol}://${host}:${port}/sql`;
	};
}
export const db = drizzleHttp({
	client: neon(connectionString),
	schema,
	casing: "snake_case",
});
