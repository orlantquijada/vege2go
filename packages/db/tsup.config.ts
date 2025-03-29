import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entry: ["./src/index.ts", "./src/client.ts", "./src/schema.ts"],
	format: "esm",
	sourcemap: true,
	minify: !options.watch,
}));
