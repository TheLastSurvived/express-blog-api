import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  imageUrl: String,
  tags: {
    type: Array,
    default: [],
  },
});

export default mongoose.model("Article", articleSchema);
