import { Hono } from "hono";

export type Env = {
  DATABASE_URL: string;
};

export const income = new Hono<{ Bindings: Env }>();

income.get("/", (c) => {
  return c.json({ name: "income Route" });
});
