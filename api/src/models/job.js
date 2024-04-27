import { Schema, model } from "mongoose";

const jobSchema = new Schema(
  {
    job_name: {
      type: String,
      required: true,
    },
    job_description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = model("Job", jobSchema);

export default Job;
