"use strict";
const host = "http://localhost:5000/api/v1";
// const host = "b.mortezaom.dev:5000/api/v1";
let userP = [];

// Get User By Id
async function getUserById(id) {
  const response = await fetch(`${host}/users/${id}`);

  const resData = await response.json();
  userP = resData.user;
  console.log(resData);

  document.querySelector(".userType").innerText = `${
    userP.isAdmin === true ? "Admin" : "User"
  }`;
  document.querySelector(".username").innerText = userP.username;
  document.querySelector(".userProfile").src = `${host}${userP.profile}`;

  // if (userP.isAdmin !== true) {
  //   document.addEventListener("DOMContentLoaded", function () {
  //     // e.preventDefault();
  //     const table = document.getElementById("employeeTable");
  //     table.addEventListener("click", () => {
  //       let editEmployee = e.target.id == "edit-employee";
  //       let deleteEmployee = e.target.id == "delete-employee";
  //       if (document.documentElement.classList.include("hideForUser")) {
  //         document.documentElement.classList.remove(
  //           editEmployee,
  //           deleteEmployee
  //         );
  //       }
  //     });
  //   });
  // }
}

const userToken = localStorage.getItem("token");
if (userToken) {
  const userDecoded = parsJWT(userToken);
  getUserById(userDecoded.userId);
}

function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  try {
    const decoded = parsJWT(token);
    // console.log(decoded);
    return true;
  } catch (error) {
    return false;
  }
}

if (!isAuthenticated()) {
  window.location.href = "/index.html";
}

function parsJWT(token) {
  let base64Url = token.split(".")[1];
  let base64 = decodeURIComponent(
    atob(base64Url)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(base64);
}

function logout() {
  localStorage.removeItem("token");
  // console.log("success");
  // Redirect to the login page
  window.location.href = "/index.html";
}

// document.querySelector("#logout").addEventListener("click", logout);
