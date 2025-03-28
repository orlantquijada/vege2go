import { execSync } from "node:child_process";
import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI) {
	plop.setGenerator("init", {
		description: "Initialize a new package",
		prompts: [
			{
				type: "input",
				name: "name",
				message:
					"What is the name of the package? (You can skip the `@repo/` prefix)",
			},
		],
		actions: [
			(answers) => {
				if ("name" in answers && typeof answers.name === "string") {
					if (answers.name.startsWith("@repo/")) {
						answers.name = answers.name.replace("@repo/", "");
					}
				}
				return "Config sanitized";
			},
			{
				type: "add",
				path: "packages/{{ name }}/package.json",
				templateFile: "templates/package.json.hbs",
			},
			{
				type: "add",
				path: "packages/{{ name }}/tsconfig.json",
				templateFile: "templates/tsconfig.json.hbs",
			},
			{
				type: "add",
				path: "packages/{{ name }}/src/index.ts",
				template: "export const name = '{{ name }}';",
			},
			async (answers) => {
				if ("name" in answers && typeof answers.name === "string") {
					execSync("pnpm dlx sherif@latest --fix", {
						stdio: "inherit",
					});
					execSync("pnpm i", { stdio: "inherit" });
					execSync(`pnpm biome check --write packages/${answers.name}`);
					return "Package scaffolded";
				}
				return "Package not scaffolded";
			},
		],
	});
}
