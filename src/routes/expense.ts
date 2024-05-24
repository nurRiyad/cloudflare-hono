import { Hono } from "hono";
import { Env } from "../index";
import { HTTPException } from "hono/http-exception";
import { getDB } from "../db";
import { expensesTable } from "../schema";
import { NeonDbError } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

export const expense = new Hono<{ Bindings: Env }>();

expense.get("/", async (c) => {
  try {
    const jwtPayload = c.get("jwtPayload");
    const { id } = jwtPayload;
    if (!id) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const expenses = await db.query.expensesTable.findMany({
      where: eq(expensesTable.userId, id),
    });

    return c.json(expenses);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});

expense.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { on, amount } = body;

    const jwtPayload = c.get("jwtPayload");
    const { id } = jwtPayload;
    if (!on || !amount || !id) {
      throw new HTTPException(400, { message: "Bad request on and amount required" });
    }

    const { db } = getDB(c.env.DATABASE_URL);

    const newExpense = { on: on, amount: amount, userId: id };
    const expense = await db.insert(expensesTable).values(newExpense).returning();

    return c.json(expense);
  } catch (error) {
    if (error instanceof NeonDbError) {
      return c.json({ message: error.message }, 500);
    }
    if (error instanceof HTTPException) throw error;
    else throw new HTTPException(500, { message: "Something went wrong" });
  }
});
