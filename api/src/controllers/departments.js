import Department from "../models/department.js";
import { catchAsync } from "../middlewares.js";
import fs, { mkdir, rmdir } from "fs";
import path from "path";

export const getdepartments = catchAsync(async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    return res.status(404).json({ message: "Any Department not found" });
  }
});

// Get department By Id Function
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    // console.log(department);
    res.json({ department: department });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching Department", error: err.message });
  }
};

//  Create Department Function
export const createDepartment = catchAsync(async (req, res) => {
  try {
    const { department_name, department_description } = req.body;
    // create new owner
    const newDepartment = new Department({
      department_name: department_name,
      department_description: department_description,
    });
    await newDepartment.save();
    res.status(200).json({
      newDepartment: newDepartment,
      message: "New Department Created Successfully ",
    });
    // }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Creating Department", error: err.message });
  }
});
//  Update Department By Id Function
export const updateDepById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { department_name, department_description } = req.body;

    // let uploadPath;

    const existDepartment = await Department.findById(id);

    if (!existDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    existDepartment.department_name =
      department_name ?? existDepartment.department_name;
    existDepartment.department_description =
      department_description ?? existDepartment.department_description;

    await existDepartment.save();
    res.status(200).json({
      updatedDepartment: existDepartment,
      message: "Department Successfully Updated",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating Department", error: err.message });
  }
});

export const deleteDepById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDepartment = await Department.findByIdAndDelete(id);

    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department Successfully Deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting Department", error: err.message });
  }
});
