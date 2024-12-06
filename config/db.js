import mongoose from "mongoose";

function connectionToDatabase() {
  const dbURI = process.env.Mongo_URI;
  if (!dbURI) {
    console.log("please check your .env file");
  }

  const db = mongoose
    .connect(dbURI)
    .then(() => console.log("Database connection succeeded"))
    .catch((error) => console.error("Database connection failed:", error));
}

export default connectionToDatabase;
