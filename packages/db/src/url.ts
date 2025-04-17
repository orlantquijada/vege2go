export const connectionString =
	process.env.NODE_ENV === "development"
		? "postgres://postgres:postgres@db.localtest.me:5432/main"
		: // biome-ignore lint/style/noNonNullAssertion: <explanation>
			process.env.DATABASE_URL!;
