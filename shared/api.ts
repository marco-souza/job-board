import { Status } from "$fresh/server.ts";

export function exceptionHandler(err: Error) {
  return new Response(
    JSON.stringify({ error: err }),
    { status: Status.BadRequest },
  );
}
