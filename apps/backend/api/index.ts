import cors from "@fastify/cors";
import { appRouter, createTRPCContext } from "@repo/api";
import { db } from "@repo/db/client";
import { Post } from "@repo/db/schema";
import { attempt, formatShortDate } from "@repo/utils";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import fastify from "fastify";

const { app, start } = createServer();

if (process.env.NODE_ENV === "development") {
	start();
}

export default async (req: VercelRequest, res: VercelResponse) => {
	await app.ready();
	app.server.emit("request", req, res);
};

function createServer() {
	const app = fastify({
		maxParamLength: 5000,
		logger: true,
	});

	app.register(cors, {
		origin:
			process.env.NODE_ENV === "development"
				? "*"
				: ["https://vege2go-web-app.vercel.app"],
	});

	app.register(fastifyTRPCPlugin, {
		prefix: "/trpc",
		trpcOptions: {
			router: appRouter,
			createContext: createTRPCContext,
		},
	});

	app.get("/ping", async () => {
		return "pong";
	});

	app.get("/now", async () => {
		return formatShortDate(new Date());
	});

	app.get("/posts", async () => {
		return db.select().from(Post);
	});

	const stop = () => app.close();
	const start = async () => {
		const host = "0.0.0.0";
		const port =
			process.env.NODE_ENV === "development" ? 8080 : Number(process.env.PORT);

		const listenAttempt = await attempt(app.listen({ port, host }));

		if (!listenAttempt.success) {
			app.log.error("err", listenAttempt.error);
			process.exit(1);
		}

		if (process.env.NODE_ENV === "development")
			console.log(`listening on ${host}:${port}`);
	};

	return { app, start, stop };
}
