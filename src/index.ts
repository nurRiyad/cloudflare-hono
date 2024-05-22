import { Hono } from "hono";
import { route } from "./routes";
import { auth } from "./routes/auth";
import { HTTPException } from "hono/http-exception";

export type Env = {
  DATABASE_URL: string;
  JWT_TOKEN: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.json({
    name: "Budget Tracker",
    repo: "https://github.com/nurRiyad/cloudflare-hono",
  });
});

app.route("/api", route);
app.route("/auth", auth);

// error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ message: "Don't know what happen" }, 500);
});

export default app;
