import { Handlers, Status } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: async () => {
    const entries = db.list({ prefix: ["jokes"] })
    const jokes = []

    for await (const entry of entries) {
      jokes.push(entry.value as string)
    }

    const randomIndex = Math.floor(Math.random() * jokes.length);
    const body = jokes[randomIndex];
    return new Response(body);
  },
  POST: async (req) => {
    const { joke }: AddJokeReq = await req.json();

    db.set(['jokes', Date.now()], joke)
    
    return new Response('', { status: Status.OK })
  },
};

const JOKES_DB = "jokes:db";
const db = await Deno.openKv(JOKES_DB);

// TODO: valiedate with zod
type AddJokeReq = {
  joke: string;
};
