"use strict";

// const fileInput = upload.querySelector(".file-input");

const host = "http://localhost:5000/api/v1";

// Form Validation Function
function validateForm() {
  // Get input field values
  const userName = document.getElementById("username").value.trim();
  const lastName = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // console.log({ userName, lastName, email, password });
  // Regular expressions for validation
  // const nameRegex = /^[A-Za-z\s]+$/;
  // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // const passwordRegex =
  //   /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  // Function to display error messages
  function displayError(inputId, errorMessage) {
    // console.log("Input id", inputId);
    const input = document.getElementById(inputId);
    // console.log("Input Element", inputId);
    const small = input.parentElement.querySelector("small");
    if (errorMessage) {
      small.innerText = errorMessage;
      small.className = "error";
      input.className = "error";
      small.style.display = "block";
    }
  }

  // Clear previous error messages
  const errorMessages = document.querySelectorAll(".error");
  errorMessages.forEach((error) => {
    error.innerText = "";
  });

  // Validate Username
  if (userName === "") {
    displayError("username", "Username cannot be empty."); // Display error message
  }
  // else if (!userName.match(nameRegex)) {
  //   displayError("username", "Username must contain only letters and spaces."); // Display error message
  // }

  // Validate Last Name
  if (lastName === "") {
    displayError("lastName", "Last Name cannot be empty."); // Display error message
  }
  // else if (!lastName.match(nameRegex)) {
  //   displayError("lastName", "Last Name must contain only letters and spaces."); // Display error message
  // }

  // Validate Email
  if (email === "") {
    displayError("email", "Email cannot be empty."); // Display error message
  }
  // else if (!email.match(emailRegex)) {
  //   displayError("email", "Invalid Email."); // Display error message
  // }

  // Validate Password
  if (password === "") {
    displayError("password", "Pasword cannot be empty."); // Display error message
  } else if (password.length < 6) {
    displayError("password", "Password must contain at least 6 character");
  }
  // else if (!password.match(passwordRegex)) {
  //   displayError(
  //     "password",
  //     "weak password Password must contain only letters, number, symbols and spaces."
  //   ); // Display error message
  // }

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

// Register User
async function RegisterUser() {
  const isValid = validateForm();

  if (!isValid) {
    return;
  }

  let formdata = new FormData();
  formdata.append("username", document.getElementById("username").value);
  formdata.append("lastname", document.getElementById("lastname").value);
  formdata.append("email", document.getElementById("email").value);
  formdata.append("password", document.getElementById("password").value);
  formdata.append("file", document.getElementById("file").files[0]);

  // console.log(formdata.get("username"));
  // console.log(formdata.get("lastname"));
  // console.log(formdata.get("email"));
  console.log(formdata.get("file"));

  const response = await fetch(`${host}/users`, {
    method: "POST",
    body: formdata,
  });
  const resData = await response.json();
  console.log(resData);
  if (response.status === 200 || response.status === 201) {
    window.location.href = "/index.html";
  }
}

// Register User event
document.getElementById("register").addEventListener("click", () => {
  if (validateForm()) {
    RegisterUser(); // Only create owner if form is valid
  }
});
