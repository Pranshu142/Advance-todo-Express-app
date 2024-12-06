// Import dependencies
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import db from "./config/db.js";
import { fileURLToPath } from "url"; // Import helper to define __dirname

dotenv.config();
db();

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routers
import indexRouter from "./routes/index.routes.js";
import usersRouter from "./routes/users.routes.js";

// Initialize Express app
const app = express();
const port = 3000;

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static("/uploads", path.join(__dirname, "public/uploads")));

// Set view engine
app.set("views", path.join(__dirname, "views")); // Use defined __dirname
app.set("view engine", "ejs");

// Define routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Error handling
app.use((req, res, next) => {
  next(createError(404));
});
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Export app
export default app;
