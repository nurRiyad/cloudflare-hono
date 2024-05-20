import { Hono } from "hono";
import { getDB } from "../db";
import { usersTable } from "../schema";
import { Env } from "../index";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

export const auth = new Hono<{ Bindings: Env }>();

// proper error msg
// return without password
// has password

auth.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password, email } = body;

    if (!username || !password || !email) {
      throw new HTTPException(400, { message: "Bad request username, password & email required" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    type NewUser = typeof usersTable.$inferInsert;
    const newUser: NewUser = { name: username, password: password, email: email };
    const users = await db.insert(usersTable).values(newUser).returning();
    const user = users[0];

    const token = await sign(user, c.env.JWT_TOKEN);
    setCookie(c, "budget_key", token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
    });
    return c.json(user);
  } catch (error) {
    throw new HTTPException(500, { message: "Something went wrong" });
  }
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
