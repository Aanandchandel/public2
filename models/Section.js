import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
})

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  items: [itemSchema],
})

const Section = mongoose.model("Section", sectionSchema)

export default Section

