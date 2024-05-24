import { Hono } from "hono";
import { route } from "./routes";
import { auth } from "./routes/auth";
import { HTTPException } from "hono/http-exception";
import { prettyJSON } from "hono/pretty-json";

// Define the environment variables
export type Env = {
  DATABASE_URL: string;
  JWT_TOKEN: string;
};

const app = new Hono<{ Bindings: Env }>();

app.use(prettyJSON());

app.get("/", (c) => {
  return c.json({
    name: "Budget Tracker",
    repo: "https://github.com/nurRiyad/cloudflare-hono",
  });
});

app.route("/api", route);
app.route("/auth", auth);

// not found handler
app.notFound((c) => {
  return c.json({ message: "Not found" }, 404);
});

// error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ message: "Don't know what happen" }, 500);
});

export default app;
