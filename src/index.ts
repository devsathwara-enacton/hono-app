import { Hono } from "hono";
import mysql2 from "mysql2";

const app = new Hono();

const db = mysql2.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "tododb",
  connectTimeout: 60000,
});
app.get("/tasks", async (ctx) => {
  try {
    const data = await db.select("*").from("todos");
    return ctx.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return ctx.json({ error: "Error fetching data" }, 500);
  }
});
app.get("/", async (c) => {
  try {
    await db.raw("select 1+1 as result");
    console.log("Connected to db");
    return c.text("Hello Hono!");
  } catch (error) {
    console.error("Error connecting to db:", error);
    return c.text("Database connection error.", 500);
  }
});

// Wrap Hono app with serverless-http
export const handler = app;
