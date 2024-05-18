import { Hono } from "hono";
import { Env } from "../index";

export const income = new Hono<{ Bindings: Env }>();

income.get("/", (c) => {
  return c.json({ name: "income Route" });
});
