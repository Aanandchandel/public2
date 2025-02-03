import express from "express"
import {
  getCategories,
  addCategory,
  removeCategory,
  getSections,
  addSection,
  updateSection,
  removeSection,
  addItem,
  updateItem,
  removeItem,
  getAllItems,
  getItemsByCategory
} from "../controllers/menuController.js"
import { auth } from "../middleware/auth.js"

const router = express.Router()
router.get("/items/:categoryId", getItemsByCategory);
router.get("/categories", getCategories)
router.post("/categories", auth, addCategory)
router.delete("/categories/:id", auth, removeCategory)

router.get("/sections", getSections)
router.post("/sections", auth, addSection)
router.put("/sections/:id", auth, updateSection)
router.delete("/sections/:id", auth, removeSection)

router.get("/items", getAllItems) //This line was already present in the original code.

router.post("/sections/:sectionId/items", auth, addItem)
router.patch("/sections/:sectionId/items/:itemId", auth, updateItem)
router.delete("/sections/:sectionId/items/:itemId", auth, removeItem)


export default router

