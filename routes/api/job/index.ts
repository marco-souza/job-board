import { Handlers, Status } from "$fresh/server.ts";
import { createJobModel } from "~/entities/job.ts";
import { exceptionHandler } from "../../../shared/api.ts";

const db = await createJobModel();

export const handler: Handlers = {
  GET: async () => {
    try {
      const jobs = await db.list();
      const body = JSON.stringify(jobs);
      return new Response(body);
    } catch (e) {
      return exceptionHandler(e);
    }
  },
  POST: async (req) => {
    try {
      const data = await req.json();
      const id = await db.save(data);
      return new Response(JSON.stringify({ id }), { status: Status.OK });
    } catch (e) {
      return exceptionHandler(e);
    }
  },
  PUT: async (req) => {
    try {
      const data = await req.json();
      const id = await db.update(data);
      return new Response(JSON.stringify({ id }), { status: Status.OK });
    } catch (e) {
      return exceptionHandler(e);
    }
  },
  DELETE: async (req) => {
    try {
      const data = await req.json();
      // TODO: get id
      const id = await db.delete(data);
      return new Response(JSON.stringify({ id }), { status: Status.OK });
    } catch (e) {
      return exceptionHandler(e);
    }
  },
};
