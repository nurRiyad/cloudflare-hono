import { Hono } from "hono";
import { getDB } from "../db";
import { usersTable } from "../schema";
import { Env } from "../index";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";
import { comparePassword, hashPassword } from "../utils/hash";
import { NeonDbError } from "@neondatabase/serverless";

export const auth = new Hono<{ Bindings: Env }>();

auth.post("/signup", async (c, next) => {
  try {
    const body = await c.req.json();
    const { username, password, email } = body;

    if (!username || !password || !email) {
      throw new HTTPException(400, { message: "Bad request username, password & email required" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const hPassword = await hashPassword(password);
    const newUser = { name: username, password: hPassword, email: email };
    const users = await db.insert(usersTable).values(newUser).returning();

    const { password: pass, ...user } = users[0];
    const token = await sign(user, c.env.JWT_TOKEN);
    setCookie(c, "budget_key", token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
    });
    return c.json(user);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});

auth.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const { password, email } = body;

    if (!password || !email) {
      throw new HTTPException(400, { message: "Bad request username, password & email required" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const dbUser = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    if (!dbUser) {
      throw new HTTPException(401, { message: "Unauthorize" });
    }

    const isMatch = await comparePassword(password, dbUser.password);
    if (!isMatch) {
      throw new HTTPException(401, { message: "Unauthorize" });
    }

    const { password: hashPassword, ...user } = dbUser;
    const token = await sign(user, c.env.JWT_TOKEN);
    setCookie(c, "budget_key", token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "Strict",
    });
    return c.json(user);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});

auth.get("/logout", (c) => {
  deleteCookie(c, "budget_key");
  return c.json({
    message: "Logged out successfully",
  });
});
