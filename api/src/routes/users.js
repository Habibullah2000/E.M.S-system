import express from "express";
// import { authenticate } from "../middlewares.js";
import {
  getAllUsers,
  getUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUserById,
  // changePass,
  deleteUserById,
} from "../controllers/users.js";

const router = express.Router();

// router.get("/", authenticate,, getAllUsers);x
router.get("/", getAllUsers);
router.get("/u", getUsers);
router.get("/:id", getUserById);
router.post("/", registerUser);
router.post("/login", loginUser);
router.put("/:id", updateUserById);
// router.post("/changePass", changePass);
router.delete("/:id", deleteUserById);

export default router;
