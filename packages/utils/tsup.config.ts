import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entry: ["src/index.ts"],
	format: "esm",
	sourcemap: true,
	minify: !options.watch,
}));
