import {
	SignedIn,
	SignedOut,
	UserButton,
	useSession,
	useSignUp,
} from "@clerk/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import * as v from "valibot";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import type { Route } from "../+types/root";

export function meta(_: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	const session = useSession();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!session.isSignedIn) {
			queryClient.clear();
		}
	}, [session.isSignedIn, queryClient.clear]);

	return (
		<main>
			<div>
				<SignedIn>
					<UserButton />
				</SignedIn>
				<SignedOut>
					<SignUpForm />
				</SignedOut>
			</div>
		</main>
	);
}

const authSchema = v.object({
	username: v.pipe(v.string(), v.nonEmpty()),
	password: v.pipe(v.string(), v.nonEmpty()),
});

function SignUpForm() {
	const clerkSignup = useSignUp();
	const signUpUser = useMutation({
		mutationFn: async ({
			username,
			password,
		}: { username: string; password: string }) => {
			if (!clerkSignup.isLoaded) return;

			const res = await clerkSignup.signUp.create({ username, password });
			if (
				res.createdSessionId &&
				res.status === "complete" &&
				res.createdUserId
			) {
				await clerkSignup.setActive({
					session: res.createdSessionId,
				});
			}

			return res.createdUserId;
		},
	});

	// TODO: loading and error states
	return (
		<form
			className="mx-auto max-w-md"
			onSubmit={(e) => {
				e.preventDefault();

				const formData = new FormData(e.currentTarget);
				const data = Object.fromEntries(formData.entries());

				const parsedData = v.parse(authSchema, data);

				signUpUser.mutateAsync(parsedData);
			}}
		>
			<div>
				<Label htmlFor="username">Username</Label>
				<Input id="username" type="text" name="username" />
			</div>

			<div>
				<Label htmlFor="password">Password</Label>
				<Input id="password" type="password" name="password" />
			</div>

			<button type="submit" disabled={signUpUser.isPending}>
				Sign Up
			</button>
		</form>
	);
}
