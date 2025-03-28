import { attempt, formatShortDate } from "@repo/utils";
import * as v from "valibot";
import { api } from "~/utils/api";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const posts = api.post.all.useQuery();
	const createPost = api.post.create.useMutation();
	const id = "eb5da21f-fe92-4397-b1ea-223d0b3a5a39";
	const firstPost = api.post.id.useQuery(id);
	const utils = api.useUtils();

	return (
		<main>
			<h1>Vege2Go</h1>
			<p>{posts.data?.length}</p>
			<ul>
				{posts.data?.map((post) => (
					<li key={post.id}>
						<p>{post.title}</p>
						<p>{formatShortDate(post.createdAt)}</p>
					</li>
				))}
			</ul>

			{firstPost.data && (
				<li key={firstPost.data.id}>
					<p>{firstPost.data.title}</p>
					<p>{formatShortDate(firstPost.data.createdAt)}</p>
				</li>
			)}

			<button
				type="button"
				onClick={() => {
					createPost.mutate(
						{ title: `title ${Math.ceil(Math.random() * 1000)}` },
						{
							onSuccess: () => {
								utils.post.all.invalidate();
							},
						},
					);
				}}
			>
				create post
			</button>
		</main>
	);
}
