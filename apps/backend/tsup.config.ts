import path from "node:path";
import { defineConfig } from "tsup";

const IS_DEV = process.env.NODE_ENV === "development";
export default defineConfig({
	entry: ["api/index.ts"],
	format: "esm",
	clean: !IS_DEV,
	minify: !IS_DEV,
	platform: "node",
	watch: IS_DEV
		? ["src", path.resolve(__dirname, "../../packages/api/src")]
		: false,
});
