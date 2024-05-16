import { Hono } from "hono";
import { auth } from "./routes/auth";
import { income } from "./routes/income";
import { expense } from "./routes/expense";
import { monthlyExpense } from "./routes/monthlyExpense";
import { saving } from "./routes/saving";
import { share } from "./routes/share";

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono();

app.route("/auth", auth);
app.route("/income", income);
app.route("expense", expense);
app.route("monthlyExpense", monthlyExpense);
app.route("saving", saving);
app.route("share", share);

export default app;
