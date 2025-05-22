import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { createContextInner, createTRPCContext } from "./context.ts";
import { type AppRouter, appRouter } from "./root.ts";
import { createCallerFactory } from "./trpc.ts";

const createCaller = createCallerFactory(appRouter);

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

export { createTRPCContext, appRouter, createCaller, createContextInner };
export type { AppRouter, RouterInputs, RouterOutputs };
