import { Hono } from "hono";
import { Env } from "../index";

export const expense = new Hono<{ Bindings: Env }>();

expense.get("/", (c) => {
  return c.json({ name: "Expense Route" });
});
