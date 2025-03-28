import { defineConfig } from "drizzle-kit";

console.log("??????", process.env.NODE_ENV, process.env.DATABASE_URL);
export default defineConfig({
	out: "./drizzle",
	schema: "./src/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		url: process.env.DATABASE_URL!,
	},
	casing: "snake_case",
});
