"use strict";

// const host = "http://localhost:5000/api/v1";
const upload = document.querySelector(".upload");
const fileInput = upload.querySelector(".file-input");
const img = document.querySelector(".image-preview");

// Add an event listener for the change event on the file input
// fileInput.addEventListener("change", (event) => {
//   // Access the selected file
//   const selectedFile = event.target.files[0];

//   // You can now do whatever you want with the selected file
//   if (selectedFile) {
//     // Create a URL for the selected file
//     const objectURL = URL.createObjectURL(selectedFile);

//     // Set the src attribute of the img element to the URL
//     img.src = objectURL;

//     // You can perform further actions like uploading, displaying, or processing the file here
//   }
// });

// upload.addEventListener("click", () => {
//   fileInput.click();
// });

// #######################
// let links = document.getElementsByClassName('link');
let employeeData = [];
let employee = [];
// let totalPages = 1;
// const urlParams = new URLSearchParams(window.location.search);
// let currentPage = parseInt(urlParams.get('currentPage')) || 1;
// Cancel Owner event
// document.getElementById("cancel").addEventListener("click", () => {
//   // clean input field
//   cleanInput();
// });

// function cleanInput() {
//   document.getElementById("firstName").value = "";
//   document.getElementById("lastName").value = "";
//   document.getElementById("email").value = "";
//   document.getElementById("address").value = "";
//   document.getElementById("salary").value = "";
//   // document.getElementById("img").value = "";
// }

// Get All Departments
async function getDepartments() {
  const response = await fetch(`${host}/departments`);
  const resData = await response.json();
  // console.log(resData);
  let output = "";
  let i = 1;

  resData.forEach((department) => {
    output += `
        <option id="exist-department" value="${department._id}" selected>${department.department_name}</option>
      `;

    document.querySelector("#dep_id").innerHTML = output;
  });
}

getDepartments();

async function getEmployees() {
  try {
    const response = await fetch(`${host}/employees`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const resData = await response.json();
    employeeData = resData;
    // Display owner fields
    const rows = employeeData.map((employee, index) => {
      return `
            <tr data-id="${employee._id}">
              <td>${index + 1}</td>
              <td>${employee.first_name} ${employee.last_name}</td>
              <td>${employee.email}</td>
              <td>${employee.dep_id?.department_name}</td>
              <td>
                  <a
                    href="#"
                    class="btn btn-sm btn-block btn-info"
                    data-bs-toggle="modal"
                    data-bs-target="#employeeDetails"
                    id="details-employee"
                    >Details
                  </a>
              </td>
                <div class="editButtonBox">
                  <td>
                  <a
                    href="#"
                    class="btn btn-sm btn-block btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#employeeEditDetails"
                    id="edit-employee"
                    >Edit</a
                  >
                </td>
                <td>
                  <a
                    href="#"
                    id="delete-employee"
                    class="btn btn-sm btn-block btn-danger"
                    >Delete</a
                  >
                </td>
                </div>
            </tr>
        `;
    });
    document.querySelector(".table-body").innerHTML = rows.join("");
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
}

getEmployees();

// function validateForm() {
//   // Get input field values
//   const firstName = document.getElementById("firstName").value.trim();
//   const lastName = document.getElementById("lastName").value.trim();
//   const address = document.getElementById("address").value.trim();
//   const salary = document.getElementById("salary").value.trim();
//   // const profile = document.getElementById("img").value.trim();

//   // Regular expressions for validation
//   const nameRegex = /^[A-Za-z\s]+$/;
//   const salaryRegex = /^\d{6,9}$/; // 9-digit SSN
//   const addressRegex = /^[A-Za-z0-9\s]+$/;
//   // const imgRegex = /\.(png|PNG|jpg|JPG)$/i; // Image file extensions

//   // Function to display error messages
//   function displayError(inputId, errorMessage) {
//     const input = document.getElementById(inputId);
//     const small = input.parentElement.querySelector("small");
//     small.innerText = errorMessage;
//     small.className = "error";
//     input.className = "error";
//     small.style.display = "block";
//   }

//   // Clear previous error messages
//   const errorMessages = document.querySelectorAll(".error");
//   errorMessages.forEach((error) => {
//     error.innerText = "";
//   });

//   // Validate First Name
//   if (firstName === "") {
//     displayError("firstName", "First Name cannot be empty."); // Display error message
//   } else if (!firstName.match(nameRegex)) {
//     displayError(
//       "firstName",
//       "First Name must contain only letters and spaces."
//     ); // Display error message
//   }

//   // Validate Last Name
//   if (lastName === "") {
//     displayError("lastName", "Last Name cannot be empty."); // Display error message
//   } else if (!lastName.match(nameRegex)) {
//     displayError("lastName", "Last Name must contain only letters and spaces."); // Display error message
//   }

//   // Validate Address
//   if (address === "") {
//     displayError("address", "Address cannot be empty."); // Display error message
//   } else if (!address.match(addressRegex)) {
//     displayError(
//       "address",
//       "Address must contain only letters, numbers, and spaces."
//     ); // Display error message
//   }

//   // Validate salary
//   if (salary === "") {
//     displayError("salary", "Salary cannot be empty."); // Display error message
//   } else if (salary.length < 6 || salary.length > 9) {
//     displayError("salary", "Salary between 6 to 9 numbers."); // Display error message
//   } else if (!salary.match(salaryRegex)) {
//     displayError("Salary", "Salary must contain only numbers."); // Display error message
//   }

//   // Validate Profile Image
//   // if (profile === "") {
//   //   return true;
//   // } else if (!profile.match(imgRegex)) {
//   //   displayError(
//   //     "img",
//   //     "Profile image must have a valid file extension (png, PNG, jpg, JPG)."
//   //   ); // Display error message
//   // }

//   // Check for any displayed error messages
//   const hasErrors = Array.from(errorMessages).some(
//     (error) => error.innerText !== ""
//   );

//   // Display error messages
//   if (hasErrors) {
//     return false; // Prevent form submission
//   }

//   // Form is valid, allow submission
//   return true;
// }

// Create employee
async function createEmployee() {
  // const isValid = validateForm();
  // if (!isValid) {
  // return;
  // }

  let formdata = new FormData();

  formdata.append("first_name", document.getElementById("firstName").value);
  formdata.append("last_name", document.getElementById("lastName").value);
  formdata.append("gender", document.getElementById("gender").value);
  formdata.append("email", document.getElementById("email").value);
  formdata.append("address", document.getElementById("address").value);
  formdata.append("salary", document.getElementById("salary").value);
  formdata.append("dep_id", document.getElementById("dep_id").value);
  formdata.append("file", document.getElementById("img").files[0]);

  console.log(formdata.get("file"));

  const response = await fetch(`${host}/employees`, {
    method: "POST",
    body: formdata,
  });
  const resData = await response.json();
  if (response.status === 200 || response.status === 201) {
    window.location.reload();
  }
}

// Create employee event
document.getElementById("createEmployee").addEventListener("click", () => {
  // if (validateForm()) {
  createEmployee(); // Only create employee if form is valid
  // }
});

document
  .getElementById("employeeTable")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    let rowId = e.target.parentElement.parentElement.dataset.id;
    let deleteBtnPressed = e.target.id == "delete-employee";
    let editBtnPressed = e.target.id == "edit-employee";
    let detailsBtnPressed = e.target.id == "details-employee";

    // console.log(detailsBtnPressed);

    // console.log(rowId);

    if (deleteBtnPressed) {
      if (confirm("Are you sure, delete employee?")) {
        fetch(`${host}/employees/${rowId}`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then(() => location.reload());
      }
    }

    if (detailsBtnPressed) {
      fetch(`${host}/employees/${rowId}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          let employee = res.employee;
          let output = "";
          output += `
          <tr><td>${employee.first_name}</td></tr>
          <tr><td>${employee.last_name}</td></tr>
          <tr><td>${employee.gender}</td></tr>
          <tr><td>${employee.email}</td></tr>
          <tr><td>${employee.address}</td></tr>
          <tr><td>${employee.salary}</td></tr>
          <tr><td>${employee.dep_id.department_name}</td></tr>
          <div><img style="position:absolute; top:0; right:50px; border-radius: 50%; width: 100px; height:100px;" src="${host}${employee.profile}" alt="Employee Profile" /></div>
            `;
          document.querySelector("table > .detail-body").innerHTML = output;
        });
    }

    if (editBtnPressed) {
      const response = await fetch(`${host}/employees/${rowId}`);
      const result = await response.json();
      const employee = result.employee;
      console.log(employee);

      // set the input values
      document.getElementById("eName").value = employee.first_name;
      document.getElementById("eLastName").value = employee.last_name;
      document.getElementById("eEmail").value = employee.email;
      document.getElementById("eGender").value = employee.gender;
      document.getElementById("eAddress").value = employee.address;
      document.getElementById("eSalary").value = employee.salary;

      async function getDepartments() {
        const response = await fetch(`${host}/departments`);
        const resData = await response.json();
        // console.log(resData);
        let output = "";
        let i = 1;

        resData.forEach((department) => {
          output += `
              <option id="exist-department" value="${department._id}" selected>${department.department_name}</option>
            `;

          document.querySelector("#edep_id").innerHTML = output;
        });
      }
      getDepartments();

      document.getElementById(
        "image-preview"
      ).src = `${host}${employee.profile}`;

      async function editEmployee() {
        // Update Employee
        let formdata = new FormData();
        formdata.append("first_name", document.getElementById("eName").value);
        formdata.append(
          "last_name",
          document.getElementById("eLastName").value
        );
        formdata.append("gender", document.getElementById("eGender").value);
        formdata.append("email", document.getElementById("eEmail").value);
        formdata.append("address", document.getElementById("eAddress").value);
        formdata.append("salary", document.getElementById("eSalary").value);
        formdata.append("dep_id", document.getElementById("edep_id").value);
        formdata.append("file", document.getElementById("eFile").files[0]);
        // console.log(formdata.get("file"));

        const editResponse = await fetch(`${host}/employees/${rowId}`, {
          method: "PUT",
          body: formdata,
        });
        const employeeResult = await editResponse.json();
        if (response.status === 200) {
          // // document
          // //   .getElementById("editEmployeeId")
          // //   .setAttribute("data-bs-dismiss", "modal");
          // console.log(employeeResult.updatedEmployee);
          window.location.reload();
        }
      }

      document
        .getElementById("editEmployeeId")
        .addEventListener("click", () => {
          editEmployee();
        });
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
  }, 2000);
}
