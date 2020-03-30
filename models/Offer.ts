import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String, maxlength: 50 },
  description: { type: String, maxlength: 500 },
  price: { type: Number, max: 100000 },
  created: { type: Date },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Offer = mongoose.model("Offer", schema);

export default Offer;
