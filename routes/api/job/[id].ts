import { Handlers, Status } from "$fresh/server.ts";
import { createJobModel } from "~/entities/job.ts";
import { exceptionHandler } from "~/shared/api.ts";

const db = await createJobModel();

export const handler: Handlers = {
  GET: async (_, ctx) => {
    try {
      const id = ctx.params.id as string;
      const job = await db.find(id);
      const body = JSON.stringify({ job });
      return new Response(body);
    } catch (e) {
      return exceptionHandler(e);
    }
  },
  DELETE: async (_req, ctx) => {
    try {
      const jobId = ctx.params.id;
      const job = await db.delete(jobId);
      return new Response(
        JSON.stringify({ job }),
        { status: Status.OK },
      );
    } catch (e) {
      return exceptionHandler(e);
    }
  },
};
