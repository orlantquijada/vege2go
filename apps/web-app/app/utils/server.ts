import { createCaller, createTRPCContext } from "@repo/api";

export const server = createCaller(() => createTRPCContext());
