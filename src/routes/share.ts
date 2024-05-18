import { Hono } from "hono";
import { Env } from "../index";

export const share = new Hono<{ Bindings: Env }>();

share.get("/", (c) => {
  return c.json({ name: "Share Route" });
});
