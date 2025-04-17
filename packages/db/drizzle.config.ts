import { defineConfig } from "drizzle-kit";
import { connectionString } from "./src/url.ts";

export default defineConfig({
	out: "./drizzle",
	schema: "./src/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: connectionString,
	},
	casing: "snake_case",
});
