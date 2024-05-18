import { Hono } from "hono";
import { Env } from "../index";

export const monthlyExpense = new Hono<{ Bindings: Env }>();

monthlyExpense.get("/", (c) => {
  return c.json({ name: "Monthly expense route" });
});
