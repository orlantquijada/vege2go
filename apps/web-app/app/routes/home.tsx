import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
	useAuth,
	useSession,
} from "@clerk/react-router";
import { attempt, formatShortDate } from "@repo/utils";
import type { LoaderFunctionArgs } from "react-router";
import { v4 as uuidv4 } from "uuid";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { api } from "~/utils/api";
import { createServerCaller } from "~/utils/server";
import type { Post } from "~/utils/types";
import type { Route } from "./+types/home";

export async function loader(args: LoaderFunctionArgs) {
	const server = await createServerCaller(args);
	const posts = await server.post.all();
	const postsPrivate = await attempt(server.post.private());
	return { posts, postsPrivate: postsPrivate.success ? postsPrivate.data : [] };
}

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

// export default function Home({ loaderData }: Route.ComponentProps) {
// 	const { posts } = loaderData;
// 	return (
// 		<main>
// 			<h1 className="text-lg">Vege2Go</h1>
//
// 			<Posts initialPosts={posts} />
// 		</main>
// 	);
// }

export default function Home({ loaderData }: Route.ComponentProps) {
	const all = api.post.private.useQuery();

	const session = useSession();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!session.isSignedIn) {
			queryClient.clear();
		}
	}, [session.isSignedIn, queryClient.clear]);

	return (
		<main>
			<header>
				<SignedOut>
					<SignInButton />
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</header>

			<div className="grid grid-cols-3">
				<PostList posts={loaderData.posts} />

				<div>
					<p>private server</p>
					<PostList posts={loaderData.postsPrivate} />
				</div>

				<div>
					<p>private client</p>
					<PostList posts={all.data} isLoading={all.status === "pending"} />
				</div>
			</div>
		</main>
	);
}

function Posts({ initialPosts }: { initialPosts: Post[] }) {
	const posts = api.post.all.useQuery(undefined, { initialData: initialPosts });
	const utils = api.useUtils();
	const createPost = api.post.create.useMutation({
		onMutate: async (newPost) => {
			await utils.post.all.cancel();
			const previousPosts = utils.post.all.getData() || [];

			const _newPost = {
				...newPost,
				createdAt: new Date(),
				updatedAt: null,
				id: uuidv4(),
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
			<PostList posts={posts.data} />

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
