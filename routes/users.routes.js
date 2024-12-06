// routes/users.routes.js

import express from "express";
import userSchema from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authorization from "../middlewares/auth.js";
// import randomColor from "randomcolor";
import upload from "../config/multer.config.js";
import dayjs from "dayjs";

const router = express.Router();

// Render Signup Page

router.get("/signup", (req, res) => {
  res.json({
    message: "Welcome to the signup page of Pros App",
  });
});

// User Registration

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await userSchema.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res.status(400).json({
        error:
          "Username or email already exists. Please choose a different one.",
      });
    }

    const newUser = new userSchema({
      username,
      email,
      password,
    });
    await newUser.save();

    console.log("User registered:", newUser);
    return res.redirect(`/users/login`);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Render Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// User Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userSchema.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Username or Password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Username or Password is incorrect" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.redirect(`/users/${user.username}/create`);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", (req, res) => {
  // console.log(req.cookies.token);
  // Clear the JWT cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only set `secure` flag in production
    sameSite: "strict", // Protects against CSRF
  });
  res.status(200).json({ success: "successfully logged out" });
});

router.get("/:username/collections", authorization, async (req, res) => {
  if (req.user.username !== req.params.username) {
    return res
      .status(403)
      .json({ error: "Not authorized to access this page" });
  }

  try {
    const user = await userSchema.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Get today's start time
    const today = dayjs().startOf("day");

    // Filter today's tasks
    const todaysTasks = user.tasks.filter((task) =>
      dayjs(task.createdAt).isSame(today, "day")
    );

    // Filter previous tasks
    const previousTasks = user.tasks.filter((task) =>
      dayjs(task.createdAt).isBefore(today, "day")
    );

    res.render("collections", {
      username: req.user.username,
      user,
      todaysTasks,
      previousTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Server error");
  }
});

router.get("/:username/create", authorization, function (req, res) {
  if (req.user.username !== req.params.username) {
    return res
      .status(403)
      .json({ error: "Not authorized to access this page" });
  }
  res.render("taskCreator", { username: req.user.username });
});

// user route to save the task at the backend and display the task in the user profile
router.post("/:username/tasks", authorization, async (req, res) => {
  const { title, content } = req.body;
  // console.log({ title: title, content: content });

  try {
    const user = await userSchema.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ error: "User not found" });
    user.tasks.push({ title, content });
    await user.save();
    return res.status(200).json({ success: "task saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "error occur while saving task" });
    console.log(error);
  }
});

router.get("/:username/profile", authorization, async (req, res) => {
  // Check if the username in the token matches the username in the URL
  if (req.user.username !== req.params.username) {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const user = await userSchema.findOne({ username: req.params.username });
    if (!user) {
      return res.status(403).json({ error: "user not found." });
    }

    console.log(user.profileImage);
    res.render("profile", {
      username: req.user.username,
      tasks: user.tasks,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "something went wrong" });
  }
});

// user route to upload the profile image
router.post(
  "/:username/uploadProfileImage",
  authorization,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const userId = req.user.userId; // Ensure user is authenticated and `req.user` is populated
      const imagePath = `/uploads/${req.file.filename}`; // Path to save in the database

      // Update user's profileImage field
      const user = await userSchema.findByIdAndUpdate(
        userId,
        { profileImage: imagePath },
        { new: true }
      );
      if (!user) return res.status(404).json({ error: "User not found." });

      res.json({
        message: "Profile image updated successfully.",
        profileImage: imagePath,
      });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ error: "Failed to upload profile image." });
    }
  }
);

export default router;
