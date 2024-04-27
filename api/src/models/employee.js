import mongoose, { Schema, model } from "mongoose";

const GenderEnum = {
  male: "male",
  female: "female",
};
const employeeSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      default: GenderEnum.male,
      enum: Object.values(GenderEnum),
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    salary: {
      type: Number,
    },
    dep_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    profile: {
      type: String,
      default: "/uploads/employee/employee.png",
    },
  },
  {
    timestamps: true,
  }
);

const Employee = model("Employee", employeeSchema);

export default Employee;
