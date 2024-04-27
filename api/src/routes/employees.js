import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById,
} from "../controllers/employees.js";

const router = express.Router();

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", createEmployee);
router.put("/:id", updateEmployeeById);
router.delete("/:id", deleteEmployeeById);

export default router;
