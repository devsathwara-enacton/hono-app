import { Hono } from "hono";
import knex from "knex";
import knexConfig from "../knexfile";
import serverless from "serverless-http";
const app = new Hono();
const db = knex(knexConfig.development);
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
app.get("/data", async (c) => {
  try {
    const data = await db.select("*").from("todos");
    return c.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return c.json({ error: "Error fetching data" }, 500);
  }
});
// Wrap Hono app with serverless-http
export const handler = serverless(app);
exports.lambdaHandler = async (event, context) => {
  return await handler(event, context);
};
