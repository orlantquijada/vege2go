import path from "node:path";
import { defineConfig } from "tsup";

const IS_DEV = process.env.NODE_ENV === "development";
export default defineConfig({
	entry: ["api/index.ts"],
	external: ["@repo/api"],
	format: "esm",
	minify: !IS_DEV,
	watch: IS_DEV
		? ["src", path.resolve(__dirname, "../../packages/api/src")]
		: false,
});
