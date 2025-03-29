import { formatShortDate } from "@repo/utils";
import { api } from "~/utils/api";
import type { Post } from "~/utils/types";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return (
		<main>
			<h1 className="text-lg">Vege2Go</h1>

			<Posts />
		</main>
	);
}

function Posts() {
	const posts = api.post.all.useQuery();
	const utils = api.useUtils();
	const createPost = api.post.create.useMutation({
		onMutate: async (newPost) => {
			await utils.post.all.cancel();
			const previousPosts = utils.post.all.getData() || [];

			const _newPost = {
				...newPost,
				createdAt: new Date(),
				updatedAt: null,
				id: "b4705d70-0c5f-417d-880a-cc0d852bea93",
			};

			utils.post.all.setData(undefined, [...previousPosts, _newPost]);

			return { newPost: _newPost, previousPosts };
		},
		onSettled: () => {
			utils.post.all.invalidate();
		},
	});

	return (
		<section className="mt-6 flex flex-col items-start">
			<p className="font-semibold mb-4">Posts</p>
			<PostList posts={posts.data} isLoading={posts.status === "pending"} />

			<button
				className="mt-4 h-9 px-4 bg-neutral-50 text-neutral-800 rounded-md"
				type="button"
				disabled={createPost.isPending}
				aria-disabled={createPost.isPending}
				onClick={() => {
					createPost.mutate({
						title: `title ${Math.ceil(Math.random() * 1000)}`,
					});
				}}
			>
				{createPost.isPending ? "loading..." : "create post"}
			</button>
		</section>
	);
}

function PostList({
	posts,
	isLoading,
}: { posts?: Post[]; isLoading?: boolean }) {
	if (isLoading) return <span>loading...</span>;
	if (!posts?.length) return <span>No posts</span>;

	return (
		<ol>
			{posts.map((post) => (
				<PostItem key={post.id} post={post} />
			))}
		</ol>
	);
}

function PostItem({ post }: { post: Post }) {
	return (
		<li key={post.id}>
			<span>{post.title}</span> · <span>{formatShortDate(post.createdAt)}</span>
		</li>
	);
}
