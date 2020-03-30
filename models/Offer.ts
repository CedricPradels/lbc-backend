import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  created: { type: Date },
  creator: {
    account: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }
});

const Offer = mongoose.model("Offer", schema);

export default Offer;
