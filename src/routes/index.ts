import { income } from "./income";
import { expense } from "./expense";
import { monthlyExpense } from "./monthlyExpense";
import { saving } from "./saving";
import { share } from "./share";
import { Hono } from "hono";

export const route = new Hono();

route.route("/income", income);
route.route("/expense", expense);
route.route("/monthlyExpense", monthlyExpense);
route.route("/saving", saving);
route.route("/share", share);
