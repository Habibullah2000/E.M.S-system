import express from "express";
import {
  getdepartments,
  getDepartmentById,
  createDepartment,
  updateDepById,
  deleteDepById,
} from "../controllers/departments.js";

const router = express.Router();

router.get("/", getdepartments);
router.get("/:id", getDepartmentById);
router.post("/", createDepartment);
router.put("/:id", updateDepById);
router.delete("/:id", deleteDepById);

export default router;
