import mongoose from "mongoose"
import Category from "../models/Category.js"
import Section from "../models/Section.js"

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
    console.log("Fetching cateeeeeeeeeee")
    res.json({...categories,message:"success"})
  } catch (error) {
    next(error)
  }
}

export const addCategory = async (req, res, next) => {
  try {
    console.log("Adding category with data:", req.body);
    const newCategory = new Category(req.body)
    const category = await newCategory.save()
    console.log("Category saved successfully:", category);
    res.status(201).json(category)
  } catch (error) {
    console.error("Error in addCategory:", error);
    res.status(500).json({ message: error.message });
  }
}

export const removeCategory = async (req, res, next) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const category = await Category.findByIdAndDelete(req.params.id).session(session)
    if (!category) {
      await session.abortTransaction()
      return res.status(404).json({ message: "Category not found" })
    }

    await Section.deleteMany({ categoryId: req.params.id }).session(session)

    await session.commitTransaction()
    res.json({ message: "Category and associated sections removed", category })
  } catch (error) {
    await session.abortTransaction()
    next(error)
  } finally {
    session.endSession()
  }
}

export const getSections = async (req, res, next) => {
  try {
    const sections = await Section.find().lean()
    console.log("Fetching sections from database:", sections.length, "sections found")

    if (!sections) {
      console.log("No sections found in database")
      return res.json([])
    }

    console.log("Sending sections response:", sections)
    res.json(sections)
  } catch (error) {
    console.error("Error in getSections:", error)
    next(error)
  }
}

export const addSection = async (req, res, next) => {
  try {
    const { categoryId, title, icon } = req.body

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" })
    }

    const category = await Category.findById(categoryId)
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    const newSection = new Section({ title, icon, categoryId })
    const savedSection = await newSection.save()
    console.log("Added new section:", JSON.stringify(savedSection, null, 2))
    res.status(201).json(savedSection)
  } catch (error) {
    console.error("Error adding section:", error)
    next(error)
  }
}

export const updateSection = async (req, res, next) => {
  try {
    const { title, icon, categoryId, items } = req.body

    if (categoryId) {
      const category = await Category.findById(categoryId)
      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }
    }

    const updatedSection = await Section.findByIdAndUpdate(
      req.params.id,
      { title, icon, categoryId, items },
      { new: true, runValidators: true },
    )

    if (!updatedSection) {
      return res.status(404).json({ message: "Section not found" })
    }
    res.json(updatedSection)
  } catch (error) {
    next(error)
  }
}

export const removeSection = async (req, res, next) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id)
    if (!section) {
      return res.status(404).json({ message: "Section not found" })
    }
    res.json({ message: "Section removed", section })
  } catch (error) {
    next(error)
  }
}

export const addItem = async (req, res, next) => {
  try {
    const { sectionId } = req.params
    const { items } = req.body

    const section = await Section.findById(sectionId)
    if (!section) {
      return res.status(404).json({ message: "Section not found" })
    }

    section.items.push(...items)
    await section.save()

    res.status(201).json(section)
  } catch (error) {
    next(error)
  }
}

export const updateItem = async (req, res, next) => {
  try {
    const { sectionId, itemId } = req.params
    const { price, name, isVeg } = req.body

    const section = await Section.findById(sectionId)
    if (!section) {
      return res.status(404).json({ message: "Section not found" })
    }

    const item = section.items.id(itemId)
    if (!item) {
      return res.status(404).json({ message: "Item not found" })
    }

    if (price !== undefined) item.price = price
    if (name !== undefined) item.name = name
    if (isVeg !== undefined) item.isVeg = isVeg

    await section.save()

    res.json(section)
  } catch (error) {
    next(error)
  }
}

export const removeItem = async (req, res, next) => {
  try {
    const { sectionId, itemId } = req.params

    const section = await Section.findById(sectionId)
    if (!section) {
      return res.status(404).json({ message: "Section not found" })
    }

    section.items = section.items.filter((item) => item._id.toString() !== itemId)
    await section.save()

    res.json(section)
  } catch (error) {
    next(error)
  }
}

export const getAllItems = async (req, res, next) => {
  try {
    const sections = await Section.find().lean()
    const items = sections.reduce((acc, section) => {
      return acc.concat(
        section.items.map((item) => ({
          ...item,
          _id: item._id.toString(), // Ensure _id is a string
          sectionId: section._id.toString(),
          sectionTitle: section.title,
        })),
      )
    }, [])
    res.json(items)
  } catch (error) {
    next(error)
  }
}


export const getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    // Find sections that match the categoryId
    const sections = await Section.find({ categoryId });

    if (!sections.length) {
      return res.status(404).json({ message: "No items found for this category" });
    }

    // Extracting all items from matching sections
    const items = sections.flatMap((section) => section.items);

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

