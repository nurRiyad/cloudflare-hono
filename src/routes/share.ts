import { Hono } from "hono";

export type Env = {
  DATABASE_URL: string;
};

export const share = new Hono<{ Bindings: Env }>();

share.get("/", (c) => {
  return c.json({ name: "Share Route" });
});
