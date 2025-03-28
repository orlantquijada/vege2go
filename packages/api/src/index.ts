import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { type AppRouter, appRouter } from "./root.ts";
import { createCallerFactory, createTRPCContext } from "./trpc.ts";

const createCaller = createCallerFactory(appRouter);

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { createTRPCContext, appRouter, createCaller };
export type { AppRouter, RouterInputs, RouterOutputs };
