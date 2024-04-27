"use strict";
let links = document.getElementsByClassName("link");
let userData = [];
let user = [];

// This function use to decode the Jwt-token
function parseJwt(token) {
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

// for upload
const profUpload = document.querySelector("#edit-prof");
const profFileInput = document.querySelector(".file-input");
const existimg = document.querySelector(".user-image");
const profimg = document.querySelector(".image-preview"); // Assuming you have an <img> element with the class "image-preview"
let originId;
// Add an event listener for the change event on the file input
profFileInput.addEventListener("change", (event) => {
  // Access the selected file
  const selectedFile = event.target.files[0];

  // You can now do whatever you want with the selected file
  if (selectedFile) {
    // Create a URL for the selected file
    const objectURL = URL.createObjectURL(selectedFile);
    existimg.style.display = "none";
    // Set the src attribute of the img element to the URL
    profimg.src = objectURL;
    profimg.style.display = "block";
    // Update Tenant event
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    fillInputForUpdateuser();
    updateUserById(decoded.userId); // Only create tenant if form is valid
    closeModal();
    cleanInput();
  }
});

// Trigger the file input when the upload element is clicked
profUpload.addEventListener("click", () => {
  fileInput.click();
});

const upload = document.querySelector(".upload");
const fileInput = upload.querySelector(".file-input");
const img = document.querySelector(".image-preview"); // Assuming you have an <img> element with the class "image-preview"

// Add an event listener for the change event on the file input
fileInput.addEventListener("change", (event) => {
  // Access the selected file
  const selectedFile = event.target.files[0];

  // You can now do whatever you want with the selected file
  if (selectedFile) {
    // Create a URL for the selected file
    const objectURL = URL.createObjectURL(selectedFile);

    // Set the src attribute of the img element to the URL
    img.src = objectURL;

    // You can perform further actions like uploading, displaying, or processing the file here
  }
});

// Trigger the file input when the upload element is clicked
upload.addEventListener("click", () => {
  fileInput.click();
});

//   Get tenants By Id
async function getUserById(id) {
  const response = await fetch(`${host}/users/${id}`);
  const resData = await response.json();
  // console.log(resData);
  user = resData.user;
  document.querySelector(".user-image").src = `${host}${user.profile}`;
  document.querySelector(
    ".username"
  ).innerText = `${user.username} ${user.last_name}`;
  document.querySelector(".email").innerText = user.email;
  // console.log(user.isAdmin);
  // if (user.isAdmin !== true) {
  //   document.querySelector(".users-list").classList.add("hideForUser");
  // }
}

// const token = localStorage.getItem("token");
// const decoded = parseJwt(token);
// originId = decoded.userId;
getUserById();
// edit user data
document
  .querySelector("#edituserForm")
  .addEventListener("click", fillInputForUpdateuser);

function fillInputForUpdateuser() {
  document.getElementById("username").value = user.username;
  document.getElementById("lastName").value = user.last_name;
  document.getElementById("email").value = user.email;
  // document.getElementById("password").value = user.password;

  document.getElementById("picture").src = `${host}${user.profile}`;
}

// Cancel User event
document.getElementById("cancel").addEventListener("click", () => {
  cleanInput();

  //  Close Modal
  closeModal();
});

// Clean input function
function cleanInput() {
  document.getElementById("username").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  // document.getElementById("password").value = "";
  document.getElementById("img").value = "";
}

// Get User with pagination
async function getUsers() {
  try {
    const response = await fetch(`${host}/users`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const resData = await response.json();
    userData = resData.users;
    const rows = userData.map((user, index) => {
      const submitDate = new Date(user.updatedAt).toLocaleDateString();
      // <td>${user.address}</td>
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${user.username} ${user.last_name}</td>
          <td>${user.isAdmin == true ? "Admin" : "User"}</td>
          <td>${user.email}</td>
          <td>
            <span class="prof">
              <a href="${host}${
        user.profile
      }" target="_blank"><img src="${host}${user.profile}" alt="${
        user.username
      } image"/></a>
            </span>
          </td> 
          <td>${submitDate}</td>
          <td class="primary"><a href="./user_details.html?id=${
            user._id
          }" data-target="_blank">Details</a></td>

        </tr>
        `;
    });

    // <td><a class="show-modal" id="editUserBtn">
    // <span class="material-icons-sharp" id="edit-prof">edit</span>
    // </a></td>
    // <td><a class="" id="deleteUserBtn">
    // <span class="material-icons-sharp" id="edit-prof">trash</span>
    // </a></td>

    // totalPages = resData.totalPages;
    // document.querySelector("table > .table-body").innerHTML = rows.join("");
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

// Call GET Owner Function
getUsers(currentPage);

/* Pagination functions start*/

// Form Validation Function
function validateForm() {
  // Get input field values
  const userName = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  // const password = document.getElementById("password").value.trim();
  const profile = document.getElementById("img").value.trim();

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // const passwordRegex =
  //   /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  const imgRegex = /\.(png|PNG|jpg|JPG)$/i; // Image file extensions

  // Function to display error messages
  function displayError(inputId, errorMessage) {
    const input = document.getElementById(inputId);
    const small = input.parentElement.querySelector("small");
    small.innerText = errorMessage;
    small.className = "error";
    input.className = "error";
    small.style.display = "block";
  }

  // Clear previous error messages
  const errorMessages = document.querySelectorAll(".error");
  errorMessages.forEach((error) => {
    error.innerText = "";
  });

  // Validate Username
  if (userName === "") {
    displayError("username", "Username cannot be empty."); // Display error message
  } else if (!userName.match(nameRegex)) {
    displayError("username", "Username must contain only letters and spaces."); // Display error message
  }

  // Validate Last Name
  if (lastName === "") {
    displayError("lastName", "Last Name cannot be empty."); // Display error message
  } else if (!lastName.match(nameRegex)) {
    displayError("lastName", "Last Name must contain only letters and spaces."); // Display error message
  }

  // Validate Email
  if (email === "") {
    displayError("email", "Email cannot be empty."); // Display error message
  } else if (!email.match(emailRegex)) {
    displayError("email", "Invalid Email."); // Display error message
  }

  // Validate Password
  // if (password === "") {
  //   displayError("password", "Pasword cannot be empty."); // Display error message
  // } else if (password.length < 6) {
  //   displayError("password", "Password must contain at least 6 character");
  // } else if (!password.match(passwordRegex)) {
  //   displayError(
  //     "password",
  //     "weak password Password must contain only letters, number, symbols and spaces."
  //   ); // Display error message
  // }

  // Validate Profile Image
  if (profile === "") {
    displayError("img", "Profile image cannot be empty."); // Display error message
  } else if (!profile.match(imgRegex)) {
    displayError(
      "img",
      "Profile image must have a valid file extension (png, PNG, jpg, JPG)."
    ); // Display error message
  }

  // Check for any displayed error messages
  const hasErrors = Array.from(errorMessages).some(
    (error) => error.innerText !== ""
  );

  // Display error messages
  if (hasErrors) {
    return false; // Prevent form submission
  }

  // Form is valid, allow submission
  return true;
}

// Update Users
async function updateUserById(id) {
  const isValid = validateForm();
  if (!isValid) {
    return;
  }
  let formdata = new FormData();
  formdata.append("username", document.getElementById("username").value);
  formdata.append("last_name", document.getElementById("lastName").value);
  formdata.append("email", document.getElementById("email").value);
  // formdata.append("password", document.getElementById("password").value);
  formdata.append("file", document.getElementById("img").files[0]);

  // Update users
  const response = await fetch(`${host}/users/${id}`, {
    method: "PUT",
    body: formdata,
  });
  const resData = await response.json();
  if (response.status === 200 || response.status === 201) {
    let successMsg = `<span class="notification-icon material-icons-sharp">check_circle</span> ${resData.message}`;
    showToast(successMsg);
    // Close the modal when the form is successfully submitted
    closeModal();
    // Clean input fields
    cleanInput();
    // setTimeout(() => {
    //   window.location.href = `/users.html?id=${originId}`;
    // }, 2000);
  } else if (response.status === 404 || response.status === 400) {
    let errorMsg = `<span class="notification-icon material-icons-sharp">cancel</span> ${resData.message}`;
    showToast(errorMsg);
  } else if (response.status === 500) {
    let warningMsg = `<span class="notification-icon material-icons-sharp">error</span> ${resData.message}`;
    showToast(warningMsg);
  }
}

// Update Tenant event
document.getElementById("editUserId").addEventListener("click", () => {
  if (validateForm()) {
    updateUserById(); // Only create owner if form is valid
  }
});

// toast box
let toastBox = document.getElementById("toast-box");
// Show toast function
function showToast(msg) {
  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerHTML = msg;
  toastBox.appendChild(toast);

  if (msg.includes("Successfully")) {
    toast.classList.add("success");
  } else if (msg.includes("already")) {
    toast.classList.add("warning");
  } else if (msg.includes("Error") || msg.includes("Not Found")) {
    toast.classList.add("error");
  }

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
