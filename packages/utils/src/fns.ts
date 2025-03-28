type Success<T> = { success: true; data: T };
type Failure<E = Error> = { success: false; error: E };

type Result<T, E = Error> = Success<T> | Failure<E>;

function ok<T>(data: T): Success<T> {
	return { success: true, data };
}
function err<E = Error>(error: E): Failure<E> {
	return { success: false, error };
}

export async function attempt<T, E = Error>(
	promise: Promise<T>,
): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return ok(data);
	} catch (error) {
		return err(error as E);
	}
}
