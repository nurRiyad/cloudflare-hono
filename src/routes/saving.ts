import { Hono } from "hono";
import { Env } from "../index";

export const saving = new Hono<{ Bindings: Env }>();

saving.get("/", (c) => {
  return c.json({ name: "Saving Route" });
});
