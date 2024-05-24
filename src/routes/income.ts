import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { getDB } from "../db";
import { incomesTable } from "../schema";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

export const income = new Hono<{ Bindings: Env }>();

income.get("/", async (c) => {
  try {
    const jwtPayload = c.get("jwtPayload");
    const { id } = jwtPayload;
    if (!id) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const incomes = await db.query.incomesTable.findMany({
      where: eq(incomesTable.userId, id),
    });

    return c.json(incomes);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});

income.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { from, amount } = body;

    const jwtPayload = c.get("jwtPayload");
    const { id } = jwtPayload;
    if (!from || !amount || !id) {
      throw new HTTPException(400, { message: "Bad request from and amount required" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const newIncome = { from: from, amount: amount, userId: id };
    const income = await db.insert(incomesTable).values(newIncome).returning();

    return c.json(income);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});
