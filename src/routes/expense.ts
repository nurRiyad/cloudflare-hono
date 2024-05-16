import { Hono } from "hono";

export type Env = {
  DATABASE_URL: string;
};

export const expense = new Hono<{ Bindings: Env }>();

expense.get("/", (c) => {
  return c.json({ name: "Expense Route" });
});
