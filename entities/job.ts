import { z } from "zod";

export const Job = z.object({
  id: z.string(),
  url: z.string(),
  title: z.string(),
  logo: z.string(),
});

export type Job = z.infer<typeof Job>;

export type Database<T extends { id: string }> = {
  list(): Promise<T[]>;
  find(id: string): Promise<T | null>;
  delete(id: T["id"]): Promise<T | null>;
  save(entity: any): Promise<string>;
  update(entity: any): Promise<string>;
};

export async function createJobModel(): Promise<Database<Job>> {
  const db = await Deno.openKv();

  return {
    async save(data) {
      // parse
      const partialJob = await Job.omit({ id: true }).parseAsync(data);

      // make id
      const id = Math.random().toString(36).slice(2);
      await db.set(["job", id], { id, ...partialJob });

      return id;
    },
    async update(data) {
      // parse
      const job = await Job.required({ id: true }).parseAsync(data);

      // merge objects
      const dbJob = await db.get<Job>(["job", job.id]);
      const updatedJob = dbJob ? { ...dbJob.value, ...job } : job;

      // persist
      await db.set(["job", updatedJob.id], updatedJob);
      return updatedJob.id;
    },
    async find(id) {
      const dbJob = await db.get<Job>(["job", id]);
      if (!dbJob) return null;
      return dbJob.value;
    },
    async delete(id) {
      // parse
      const dbJob = await db.get<Job>(["job", id]);
      if (!dbJob) return null;

      // merge objects
      await db.delete(["job", id]);
      return dbJob.value;
    },
    async list() {
      const jobs = db.list({ prefix: ["job"] });
      const jobList: Job[] = [];

      // TODO: paginated search
      for await (const job of jobs) {
        jobList.push(job.value as Job);
      }

      return jobList;
    },
  };
}
