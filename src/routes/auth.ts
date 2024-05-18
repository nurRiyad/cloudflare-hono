import { Hono } from "hono";
import { getDB } from "../db";
import { usersTable } from "../schema";
import { Env } from "../index";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

export const auth = new Hono<{ Bindings: Env }>();

auth.get("/login", async (c) => {
  const payload = {
    name: "John Doe",
  };

  const token = await sign(payload, c.env.JWT_TOKEN);

  setCookie(c, "budget_key", token, {
    path: "/",
    secure: true,
    httpOnly: true,
    sameSite: "Strict",
  });
  return c.json(payload);
});

auth.get("/logout", (c) => {
  deleteCookie(c, "budget_key");
  return c.json({
    message: "Logged out successfully",
  });
});

auth.get("/me", async (c) => {
  try {
    const { db } = getDB(c.env.DATABASE_URL);
    const allUser = (await db.select().from(usersTable)) || [];
    return c.json(allUser);
  } catch (error) {
    return c.json({ msg: "Something went wrong" });
  }
});
