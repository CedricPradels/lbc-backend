import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import cors from "cors";
app.use(cors());
import formidableMiddleware from "express-formidable";
app.use(formidableMiddleware());
import user from "./routes/user";
app.use(user);

import mongoose from "mongoose";
mongoose.connect(`${process.env.MONGODB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

app.all("*", (req, res) =>
  res.status(404).json({ message: "Page not found." })
);

app.listen(`${process.env.PORT}`, () => console.log("Server's runing..."));
