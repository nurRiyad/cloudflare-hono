import { Hono } from "hono";

export type Env = {
  DATABASE_URL: string;
};

export const monthlyExpense = new Hono<{ Bindings: Env }>();

monthlyExpense.get("/", (c) => {
  return c.json({ name: "Monthly expense route" });
});
