import { Hono } from "hono";
import { route } from "./routes";
import { auth } from "./routes/auth";
import { jwt } from "hono/jwt";

export type Env = {
  DATABASE_URL: string;
  JWT_TOKEN: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use("/api/*", (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_TOKEN,
    cookie: "budget_key",
  });
  return jwtMiddleware(c, next);
});

app.route("/api", route);
app.route("/auth", auth);

export default app;
