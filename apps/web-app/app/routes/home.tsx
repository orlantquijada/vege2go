import { formatShortDate } from "@repo/utils";
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
			<h1 className="text-lg">Vege2Go</h1>
			<div className="mt-4">
				<p className="font-semibold">Posts</p>
				<ol>
					{posts.data?.map((post) => (
						<li key={post.id}>
							<span>{post.title}</span> ·{" "}
							<span>{formatShortDate(post.createdAt)}</span>
						</li>
					))}
				</ol>
			</div>

			{firstPost.data && (
				<div className="mt-4">
					<p className="font-semibold">First Post</p>
					<div key={firstPost.data.id}>
						<span>{firstPost.data.title}</span> ·{" "}
						<span>{formatShortDate(firstPost.data.createdAt)}</span>
					</div>
				</div>
			)}

			<button
				className="mt-4 h-9 px-4 bg-neutral-50 text-neutral-800 rounded-md"
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
