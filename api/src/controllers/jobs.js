import Job from "../models/job.js";
import { catchAsync } from "../middlewares.js";
import fs, { mkdir, rmdir } from "fs";
import path from "path";

export const getJobs = catchAsync(async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    return res.status(404).json({ message: "Any Job not found" });
  }
});

// Get job By Id Function
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    // console.log(job);
    res.json({ job: job });
  } catch (err) {
    res.status(500).json({ message: "Error fetching Job", error: err.message });
  }
};

//  Create Job Function
export const createJob = catchAsync(async (req, res) => {
  try {
    const { job_name, job_description } = req.body;
    // create new owner
    const newJob = new Job({
      job_name: job_name,
      job_description: job_description,
    });
    await newJob.save();
    res.status(200).json({
      newJob: newJob,
      message: "New Job Created Successfully ",
    });
    // }
  } catch (err) {
    res.status(500).json({ message: "Error Creating Job", error: err.message });
  }
});
//  Update Job By Id Function
export const updateJobById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { job_name, job_description } = req.body;

    // let uploadPath;

    const existJob = await Job.findById(id);

    if (!existJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    existJob.job_name = job_name ?? existJob.job_name;
    existJob.job_description = job_description ?? existJob.job_description;

    await existJob.save();
    res.status(200).json({
      updatedJob: existJob,
      message: "Job Successfully Updated",
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating Job", error: err.message });
  }
});

export const deleteJobById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await Job.findByIdAndDelete(id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting Job", error: err.message });
  }
});
