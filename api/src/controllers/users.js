import User from "../models/user.js";
import path from "path";
import fs, { mkdir } from "fs";
// import { authenticate, catchAsync } from "../middlewares.js";
import { catchAsync } from "../middlewares.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// export const getAllUsers = catchAsync(async (req, res) => {
//   const page = parseInt(req.query.page) ?? 1;
//   const perPage = 10;
//   try {
//     const users = await User.find()
//     .skip((page-1) * perPage)
//     .limit(perPage);

//     const totalUsers = await User.countDocuments();
//     const totalPages = Math.ceil(totalUsers / perPage);

//     // let allUsers = {...users}._doc;
//     // delete allUsers.password;
//     console.log(allUsers);
//     res.status(200).json({
//       users,
//       currentPage: page,
//       totalPages,
//       totalUsers
//     });
//   } catch (error) {
//     return res.status(404).json({ message: "Any Owners not found" });
//   }
// });

// Get All User
// export const getAllUsers = catchAsync(async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json({users});
//   } catch (error) {
//     return res.status(404).json({ message: "Any Users not found" });
//   }
// });

export const getAllUsers = catchAsync(async (req, res) => {
  // const page = parseInt(req.query.page) ?? 1;
  // const perPage = 10;
  try {
    const users = await User.find().select("-password"); // Exclude the 'password' field
    // .skip((page - 1) * perPage)
    // .limit(perPage);

    const totalUsers = await User.countDocuments();
    // const totalPages = Math.ceil(totalUsers / perPage);

    res.status(200).json({
      users,
      // currentPage: page,
      // totalPages,
      totalUsers,
    });
  } catch (error) {
    return res.status(404).json({ message: "Any employee not found" });
  }
});

export const getUsers = catchAsync(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    return res.status(404).json({ message: "Any Users not found" });
  }
});

// Get User By Id Function
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    let newUser = { ...user }._doc;
    delete newUser.password;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log(owner);
    res.json({ user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching User", error: err.message });
  }
};

// Register User
export const registerUser = catchAsync(async (req, res) => {
  try {
    const { username, lastname, email, password, isAdmin } = req.body;
    // console.log(req.body);
    // console.log(req.files);
    const existingUser = await User.findOne({ email: email });
    let uploadPath;
    if (existingUser) {
      res.status(500).json({ message: "email is already exist" });
    } else {
      try {
        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).send("No file were uploaded.");
        }
        const file = req.files.file;
        mkdir(
          path.resolve(path.dirname("") + `/src/uploads/users`),
          function (err) {
            if (err) {
              if (err.code == "EEXIST") return null;
              else return err;
            } else return null;
          }
        );
        let ext = file.name.split(".").filter(Boolean).slice(1).join(".");
        let filePath = path.resolve(
          path.dirname("") + `/src/uploads/users/${username}` + "." + ext
        );
        file.mv(filePath, function (err) {
          if (err) return res.status(500).send(err);
        });
        uploadPath = `/uploads/users/${username}` + "." + ext;
      } catch (error) {
        console.log(error);
      }

      const newUser = new User({
        username: username,
        lastname: lastname,
        email: email,
        password: bcrypt.hashSync(password, 10),
        // address: address,
        isAdmin: isAdmin,
        profile: uploadPath,
      });
      const userData = await newUser.save();
      let token = jwt.sign({ userId: newUser._id }, process.env.SECRET, {
        expiresIn: 60,
      });

      let user = { ...userData }._doc;
      delete newUser.password;

      res.status(201).json({
        user,
        token,
      });
    }
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
});

export const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  const user = await User.findOne({ email });
  // if(email !== user.email || password !==user.password || user_type !== user.user_type) return res.status(400).json({'message': "Email and "})

  if (!user) {
    res.status(404).send({ message: "User Not found" });
  } else {
    const isMatch = bcrypt.compareSync(password, user.password);

    if (isMatch) {
      let token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: 86400,
      });

      let newUser = { ...user }._doc;
      delete newUser.password;
      res.status(200).send({ user, token });
    } else {
      res.status(400).send({
        message: "Password isn't correct",
      });
    }
  }
});

// Change Password
export const changePass = catchAsync(async (req, res) => {
  const { id, currentPass, newPass } = req.body;
  const user = await User.findById(id);
  if (!user) {
    res.status(404).send({ message: "User Not Found" });
  } else {
    const isMatch = bcrypt.compareSync(currentPass, user.password);
    if (isMatch) {
      user.password = bcrypt.hashSync(newPass);
      await user.save();
      res.status(200).send({
        message: "your password has been changed successfully",
      });
    } else {
      res.status(400).send({
        message: "Current password isn't correct",
      });
    }
  }
});

export const updateUserById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, lastname, password, isAdmin } = req.body;
    let uploadPath;
    const existuser = await User.findById(id);
    // console.log(existuser);
    if (!existuser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.files && req.files.file) {
      const file = req.files.file;
      const ext = file.name.split(".").pop();

      const oldFilePath = path.resolve(
        path.dirname("") + "/src/uploads/users" + existuser.profile
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
          path.resolve(path.dirname("") + `/src/uploads/users`),
          function (err) {
            if (err) {
              if (err.code == "EEXIST") return null;
              else return err;
            } else return null;
          }
        );
        let ext = file.name.split(".").filter(Boolean).slice(1).join(".");
        let filePath = path.resolve(
          path.dirname("") + `/src/uploads/users/${username}` + "." + ext
        );
        file.mv(filePath, function (err) {
          if (err) return res.status(500).send(err);
        });
        uploadPath = `/uploads/users/${username}` + "." + ext;
        // }
      } catch (error) {
        res
          .status(500)
          .json({ message: "No profile does uploeaded", error: err.message });
      }
    }

    // existuser.first_name = firs_name ?? existuser.first_name;
    existuser.username = username ?? existuser.username;
    existuser.lastname = lastname ? lastname : existuser.lastname;
    existuser.email = email ?? existuser.email;
    existuser.password = password ?? existuser.password;
    // existuser.address = address ?? existuser.address;
    existuser.isAdmin = isAdmin ?? existuser.isAdmin;
    existuser.profile = uploadPath ?? existuser.profile;

    await existuser.save();

    res.status(200).json(existuser);
  } catch (err) {
    res.status(500).json({
      message: "Error updating user: username, email, password or isAdmin",
      error: err.message,
    });
  }
});

export const deleteUserById = catchAsync(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "employee not found" });
    }

    // const oldFilePath = path.resolve(
    //   path.dirname("") + "/src/" + deletedUser.profile
    // );
    // try {
    //   await fs.promises.unlink(oldFilePath);
    // } catch (error) {
    //   console.log(error);
    // }
    res.status(200).json({ message: "User Successfully Deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting User", error: err.message });
  }
});
