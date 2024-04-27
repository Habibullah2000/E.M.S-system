"use strict";
const host = "http://localhost:5000/api/v1";

// Form Validation Function
function validateForm() {
  // Get input field values
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  // const userType = document.getElementById('userType').value.trim();

  // Regular expressions for validation
  // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // const passwordRegex =
  //   /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  // let password1 = "emps123";
  // if (password1.match(passwordRegex)) {
  //   console.log("valid");
  // } else {
  //   console.log("Not valid");
  // }
  // Function to display error messages
  function displayError(inputId, errorMessage) {
    const input = document.getElementById(inputId);
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
  //  else if (!password.match(passwordRegex)) {
  //   displayError(
  //     "password",
  //     "weak password Password must contain only letters, number, symbols and spaces."
  //   ); // Display error message
  // }

  // Validate User Type
  // if (userType === '') {
  //   displayError('user_type', 'User Type cannot be empty.');
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
async function LoginUser() {
  const isValid = validateForm();
  if (!isValid) {
    return;
  }

  let formdata = new FormData();
  formdata.append("email", document.getElementById("email").value);
  formdata.append("password", document.getElementById("password").value);
  // formdata.append("user_type", document.getElementById('userType').value);

  // console.log(formdata.get('first_name'));
  const response = await fetch(`${host}/users/login`, {
    method: "POST",
    body: formdata,
  });
  const resData = await response.json();
  console.log(resData);

  // Inside LoginUser() function after successful login
  if (response.status === 200 || response.status === 201) {
    // console.log(resData);
    localStorage.setItem("token", resData.token);
    // Redirect to another page or perform other actions
    window.location.href = "/dashboard.html";
  }
}

// Login User event
document.querySelector("#signIn").addEventListener("click", () => {
  if (validateForm()) {
    LoginUser(); // Only if login form is valid
  }
});
