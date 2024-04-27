import mongoose, { Schema, model } from "mongoose";

const departmentSchema = new Schema(
  {
    department_name: {
      type: String,
      required: true,
    },
    department_description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Department = model("Department", departmentSchema);

export default Department;
