import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entry: ["src/index.ts"],
	format: "esm",
	sourcemap: true,
	dts: true,
	minify: !options.watch,
}));
