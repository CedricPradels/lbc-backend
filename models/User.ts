import mongoose from "mongoose";

export interface userModel {
  email: string;
  token: string;
  hash: string;
  salt: string;
  account: {
    username: string;
    phone?: string;
  };
}

const model = new mongoose.Schema({
  email: { type: String, unique: true },
  token: String,
  hash: String,
  salt: String,
  account: {
    username: { type: String, required: true },
    phone: { type: String }
  }
});

const User = mongoose.model("User", model);

export default User;
