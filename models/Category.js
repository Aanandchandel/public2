import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
})

const Category = mongoose.model("Category", categorySchema)

export default Category

