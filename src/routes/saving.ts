import { Hono } from "hono";

export type Env = {
  DATABASE_URL: string;
};

export const saving = new Hono<{ Bindings: Env }>();

saving.get("/", (c) => {
  return c.json({ name: "Saving Route" });
});
