import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const taskSchema = new Schema({
  title: String,
  content: [String],
  status: {
    type: String,
    enum: ["live", "complete"],
    default: "live",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
});

// Define User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, "Username must be at least 3 characters"],
    maxlength: [20, "Username must be less than 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  profileImage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tasks: [taskSchema],
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// Export the model
export default model("User", userSchema);
