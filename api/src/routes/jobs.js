import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJobById,
  deleteJobById,
} from "../controllers/jobs.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.put("/:id", updateJobById);
router.delete("/:id", deleteJobById);

export default router;
