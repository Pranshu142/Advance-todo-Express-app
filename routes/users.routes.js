// routes/users.routes.js

import express from "express";
import userSchema from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authorization from "../middlewares/auth.js";
// import randomColor from "randomcolor";
import upload from "../config/multer.config.js";
import dayjs from "dayjs";
import { sendCongratulatoryEmail } from "../config/mailer.js";

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
    res.redirect(`/users/${user._id}/create`);
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

router.get("/:userId/collections", authorization, async (req, res) => {
  if (req.user.userId !== req.params.userId) {
    return res
      .status(403)
      .json({ error: "Not authorized to access this page" });
  }

  try {
    const user = await userSchema.findById(req.params.userId);
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

router.post("/tasks/:taskId/updateStatus", authorization, async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    // Update the specific task's status
    const user = await userSchema.findOneAndUpdate(
      { "tasks._id": taskId },
      { $set: { "tasks.$.status": status } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check today's tasks
    const today = dayjs().startOf("day");
    const todaysTasks = user.tasks.filter((task) =>
      dayjs(task.createdAt).isSame(today, "day")
    );

    const allCompleted = todaysTasks.every(
      (task) => task.status === "complete"
    );

    if (allCompleted) {
      // Check if email was already sent
      const emailAlreadySent = todaysTasks.every(
        (task) => task.emailSent === true
      );

      if (!emailAlreadySent) {
        // Send the congratulatory email
        await sendCongratulatoryEmail(user.email, user.username);

        // Update `emailSent` for all today's tasks
        await userSchema.updateOne(
          { _id: user._id },
          {
            $set: {
              "tasks.$[task].emailSent": true,
            },
          },
          {
            arrayFilters: [{ "task.createdAt": { $gte: today.toDate() } }],
            multi: true,
          }
        );
      }
    }

    res.status(200).json({ message: "Task status updated successfully." });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/update", authorization, async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await userSchema.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user details
    user.username = username;
    user.email = email;
    user.password = password; // Ensure password is hashed in your user schema
    await user.save();

    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:userId/create", authorization, async (req, res) => {
  if (req.user.userId !== req.params.userId) {
    return res
      .status(403)
      .json({ error: "Not authorized to access this page" });
  }
  try {
    const user = await userSchema.findOne({ _id: req.params.userId });
    if (!user) {
      return res.status(403).json({ error: "user not found." });
    }

    res.render("taskCreator", {
      username: user.username,
      user,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Server error");
  }
});

// user route to save the task at the backend and display the task in the user profile
router.post("/:userId/tasks", authorization, async (req, res) => {
  const { title, content } = req.body;
  // console.log({ title: title, content: content });

  try {
    const user = await userSchema.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.tasks.push({ title, content });
    await user.save();
    return res.status(200).json({ success: "task saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "error occur while saving task" });
    console.log(error);
  }
});

router.get("/:userId/profile", authorization, async (req, res) => {
  // Check if the username in the token matches the username in the URL
  if (req.user.userId !== req.params.userId) {
    return res.status(403).json({ error: "Access denied." });
  }

  try {
    const user = await userSchema.findById(req.params.userId);
    if (!user) {
      return res.status(403).json({ error: "user not found." });
    }

    // Filter today's tasks
    const liveTasks = user.tasks.filter((task) => task.status === "live");
    const completeTasks = user.tasks.filter(
      (task) => task.status === "complete"
    );

    res.render("profile", {
      username: req.user.username,
      user,
      liveTasks,
      completeTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Server error");
  }
});

// user route to upload the profile image
router.post(
  "/:userId/uploadProfileImage",
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
