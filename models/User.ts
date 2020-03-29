import mongoose from "mongoose";

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
