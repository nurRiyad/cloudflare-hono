import { income } from "./income";
import { expense } from "./expense";
import { monthlyExpense } from "./monthlyExpense";
import { saving } from "./saving";
import { share } from "./share";
import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { Env } from "..";

export const route = new Hono<{ Bindings: Env }>();

route.use("*", (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_TOKEN,
    cookie: "budget_key",
  });
  return jwtMiddleware(c, next);
});

route.get("/me", (c) => {
  const payload = c.get("jwtPayload");
  return c.json(payload);
});

route.route("/income", income);
route.route("/expense", expense);
route.route("/monthlyExpense", monthlyExpense);
route.route("/saving", saving);
route.route("/share", share);
