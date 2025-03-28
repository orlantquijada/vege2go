import type { AppRouter } from "@repo/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact, httpBatchLink, loggerLink } from "@trpc/react-query";
import { type ReactNode, useState } from "react";
import superjson from "superjson";

export const api = createTRPCReact<AppRouter>();

export function TRPCProvider(props: { children: ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				loggerLink({
					enabled: () => import.meta.env.NODE_ENV === "development",
					colorMode: "ansi",
				}),
				httpBatchLink({
					transformer: superjson,
					url: `${getBaseUrl()}/trpc`,
				}),
			],
		}),
	);

	return (
		<api.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{props.children}
			</QueryClientProvider>
		</api.Provider>
	);
}

function getBaseUrl() {
	const url = new URL(
		import.meta.env.PROD
			? import.meta.env.VITE_API_URL
			: "http://127.0.0.1:8080",
	);

	return url.origin;
}
