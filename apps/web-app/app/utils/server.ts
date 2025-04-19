import { getAuth } from "@clerk/react-router/ssr.server";
import { createCaller, createContextInner } from "@repo/api";
import type { LoaderFunctionArgs } from "react-router";

export async function createServerCaller(loaderArgs: LoaderFunctionArgs) {
	const auth = await getAuth(loaderArgs);
	return createCaller(() => createContextInner({ auth }));
}
