import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { getDB } from "../db";
import { sharesTable } from "../schema";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

export const share = new Hono<{ Bindings: Env }>();

share.get("/", async (c) => {
  try {
    const jwtPayload = c.get("jwtPayload");
    const { id } = jwtPayload;
    if (!id) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const share = await db.query.sharesTable.findMany({
      where: eq(sharesTable.userId, id),
    });

    return c.json(share);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});

share.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { type, who, amount } = body;

    const jwtPayload = c.get("jwtPayload");
    const { id } = jwtPayload;
    if (!type || !who || !amount || !id) {
      throw new HTTPException(400, { message: "Bad request type, who and amount required" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const newShare = { type: type, who: who, amount: amount, userId: id };
    const share = await db.insert(sharesTable).values(newShare).returning();

    return c.json(share);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});
