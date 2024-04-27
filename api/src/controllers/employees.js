import Employee from "../models/employee.js";
import { catchAsync } from "../middlewares.js";
import fs, { mkdir, rmdir } from "fs";
import path from "path";

export const getEmployees = catchAsync(async (req, res) => {
  try {
    const employees = await Employee.find().populate("dep_id");
    res.status(200).json(employees);
  } catch (error) {
    return res.status(404).json({ message: "Any Employees not found" });
  }
});

// Get employee By Id Function
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate("dep_id");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    // console.log(employee);
    res.json({ employee: employee });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching Employee", error: err.message });
  }
};

//  Create Employee Function
export const createEmployee = catchAsync(async (req, res) => {
  try {
    const { first_name, last_name, gender, email, address, salary, dep_id } =
      req.body;
    let uploadPath;
    console.log(req.files);
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No file were uploaded.");
      }
      const file = req.files.file;
      // console.log(file);
      // for (let i = 0; i < files.length; i++) {
      mkdir(
        path.resolve(path.dirname("") + `/src/uploads/employee`),
        function (err) {
          if (err) {
            if (err.code == "EEXIST") return null;
            else return err;
          } else return null;
        }
      );
      // console.log(file.name);
      let ext = file.name.split(".").filter(Boolean).slice(1).join(".");
      let filePath = path.resolve(
        path.dirname("") + `/src/uploads/employee/${first_name}` + "." + ext
      );
      file.mv(filePath, function (err) {
        if (err) return res.status(500).send(err);
      });
      uploadPath = `/uploads/employee/${first_name}` + "." + ext;
    } catch (error) {
      console.log(error);
    }
    // create new employee
    const newEmployee = new Employee({
      first_name: first_name,
      last_name: last_name,
      gender: gender,
      email: email,
      address: address,
      salary: salary,
      dep_id: dep_id,
      profile: uploadPath,
    });
    await newEmployee.save();
    res.status(200).json({
      newEmployee: newEmployee,
      message: "New Employee Created Successfully ",
    });
    // }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error Creating Employee", error: err.message });
  }
});
//  Update employee By Id Function
export const updateEmployeeById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, gender, email, address, salary, dep_id } =
      req.body;

    let uploadPath;
    const existEmployee = await Employee.findById(id);

    if (!existEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (req.files && req.files.file) {
      const file = req.files.file;
      const ext = file.name.split(".").pop();

      const oldFilePath = path.resolve(
        path.dirname("") + "/src/" + existEmployee.profile
      );

      try {
        await fs.promises.unlink(oldFilePath);
      } catch (error) {
        console.log(error);
      }

      try {
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send("No file were uploaded.");
        }
        const file = req.files.file;
        // console.log(file)
        // for (let i = 0; i < files.length; i++) {
        mkdir(
          path.resolve(path.dirname("") + `/src/uploads/employee/employee.png`),
          function (err) {
            if (err) {
              if (err.code == "EEXIST") return null;
              else return err;
            } else return null;
          }
        );
        let ext = file.name.split(".").filter(Boolean).slice(1).join(".");
        let filePath = path.resolve(
          path.dirname("") + `/src/uploads/employee/${first_name}` + "." + ext
        );
        file.mv(filePath, function (err) {
          if (err) return res.status(500).send(err);
        });
        uploadPath = `/uploads/employee/${first_name}` + "." + ext;
        // }
      } catch (error) {
        res
          .status(500)
          .json({ message: "No profile does uploeaded", error: err.message });
      }
    }

    existEmployee.first_name = first_name ?? existEmployee.first_name;
    existEmployee.last_name = last_name ?? existEmployee.last_name;
    existEmployee.email = email ?? existEmployee.email;
    existEmployee.gender = gender ?? existEmployee.gender;
    existEmployee.address = address ?? existEmployee.address;
    existEmployee.salary = salary ?? existEmployee.salary;
    existEmployee.dep_id = dep_id ?? existEmployee.dep_id;
    existEmployee.profile = uploadPath ?? existEmployee.profile;

    await existEmployee.save();
    res.status(200).json({
      updatedEmployee: existEmployee,
      message: "Employee Successfully Updated",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating Employee", error: err.message });
  }
});

export const deleteEmployeeById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const oldFilePath = path.resolve(
      path.dirname("") + "/src/" + deletedEmployee.profile
    );
    try {
      await fs.promises.unlink(oldFilePath);
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({ message: "Employee Successfully Deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: err.message });
  }
});
