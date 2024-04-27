"use strict";

// const host = "http://localhost:5000/api/v1";
// const upload = document.querySelector(".upload");
// const fileInput = upload.querySelector(".file-input");
// const img = document.querySelector(".image-preview");

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
let departmentData = [];
let department = [];
// let totalPages = 1;
// const urlParams = new URLSearchParams(window.location.search);
// let currentPage = parseInt(urlParams.get('currentPage')) || 1;
// Cancel Owner event
// document.getElementById("cancel").addEventListener("click", () => {
//   // clean input field
//   cleanInput();

//   // Close Modal
//   // closeModal();
// });

// function cleanInput() {
//   document.getElementById("job_id").value = "";
//   document.getElementById("des_id").value = "";
// }

async function getDepartments() {
  try {
    const response = await fetch(`${host}/departments`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const resData = await response.json();
    departmentData = resData;
    // Display owner fields
    // let date = new Date().getFullYear();
    const rows = departmentData.map((department, index) => {
      // let dob = new Date(job.dob).getFullYear(); // Access dob for each owner
      // let age = date - dob; // Calculate age for each owner
      return `
        <tr data-id="${department._id}">
          <td>${index + 1}</td>
          <td>${department.department_name}</td>
          <td>
                <a
                  href="#"
                  class="btn btn-sm btn-block btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#departmentDetails"
                  id="details-department"
                  >Details
                </a>
            </td>
            <td>
              <a
                href="#"
                class="btn btn-sm btn-block btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#departmentEditDetails"
                id="edit-department"
                >Edit</a
              >
            </td>
            <td>
              <a
                href="#"
                id="delete-department"
                class="btn btn-sm btn-block btn-danger"
                >Delete</a
              >
            </td>
        </tr>
      `;
    });
    document.querySelector(".table-body").innerHTML = rows.join("");
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
}

getDepartments();

// function validateForm() {
//   // Get input field values
//   const jobName = document.getElementById("job_id").value.trim();
//   const description = document.getElementById("des_id").value.trim();

//   // const profile = document.getElementById("img").value.trim();

//   // Regular expressions for validation
//   const nameRegex = /^[A-Za-z\s]+$/;

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
//   if (jobName === "") {
//     displayError("firstName", "First Name cannot be empty."); // Display error message
//   } else if (!jobName.match(nameRegex)) {
//     displayError("jobName", "Job name must contain only letters and spaces."); // Display error message
//   }

//   // Validate Last Name
//   if (description === "") {
//     displayError("description", "description cannot be empty."); // Display error message
//   }

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

// Create job
async function createDepartment() {
  // const isValid = validateForm();
  // if (!isValid) {
  //   return;
  // }

  let formdata = new FormData();
  // console.log(formdata.get(jobName));

  formdata.append("department_name", document.getElementById("dep_id").value);
  formdata.append(
    "department_description",
    document.getElementById("desc_id").value
  );
  // console.log(formdata.get(firstName));

  const response = await fetch(`${host}/departments`, {
    method: "POST",
    body: formdata,
  });
  const resData = await response.json();
  console.log(resData);
  // if (response.status === 200 || response.status === 201) {
  //   let successMsg = `<span class="notification-icon material-icons-sharp">check_circle</span> ${resData.message}`;
  //   showToast(successMsg);
  //   // Close the modal when the form is successfully submitted
  //   closeModal();
  //   // Clean input fields
  //   cleanInput();
  //   setTimeout(() => {
  //     window.location.href = `/jobs-list.html`;
  //   }, 2000);
  // } else if (response.status === 404 || response.status === 400) {
  //   let errorMsg = `<span class="notification-icon material-icons-sharp">cancel</span> ${resData.message}`;
  //   showToast(errorMsg);
  // } else if (
  //   response.status === 500 ||
  //   response.status === 300 ||
  //   response.status === 301
  // ) {
  //   let warningMsg = `<span class="notification-icon material-icons-sharp">error</span> ${resData.message}`;
  //   showToast(warningMsg);
  // }
}

// Create job event
document.getElementById("createDep").addEventListener("click", () => {
  // if (validateForm()) {
  createDepartment(); // Only create job if form is valid
  window.location.reload();
  // }
});

document.getElementById("depTable").addEventListener("click", async (e) => {
  e.preventDefault();
  let rowId = e.target.parentElement.parentElement.dataset.id;
  let deleteBtnPressed = e.target.id == "delete-department";
  let editBtnPressed = e.target.id == "edit-department";
  let detailsBtnPressed = e.target.id == "details-department";

  if (deleteBtnPressed) {
    if (confirm("Are you sure you want to delet this department?")) {
      fetch(`${host}/departments/${rowId}`, {
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
    // console.log("detail clicked");
    fetch(`${host}/departments/${rowId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())

      .then((res) => {
        // console.log(res);
        let department = res.department;
        let output = "";
        output += `
        <tr><td>${department.department_name}</td></tr>
        <tr><td><textarea name="" id="" cols="40" rows="3">${department.department_description}</textarea></td></tr>
          `;
        document.querySelector("table > .detail-body").innerHTML = output;
      });
  }

  if (editBtnPressed) {
    const response = await fetch(`${host}/departments/${rowId}`);
    const result = await response.json();
    const department = result.department;

    document.getElementById("eDepartment").value = department.department_name;
    document.getElementById("eDescription").value =
      department.department_description;

    async function editDepartment() {
      // Update Department
      let formdata = new FormData();
      formdata.append(
        "department_name",
        document.getElementById("eDepartment").value
      );
      formdata.append(
        "department_description",
        document.getElementById("eDescription").value
      );

      const editResponse = await fetch(`${host}/departments/${rowId}`, {
        method: "PUT",
        body: formdata,
      });

      const departmentResult = await editResponse.json();
      if (response.status === 200) {
        window.location.reload();
      }
    }

    document.getElementById("editDepId").addEventListener("click", () => {
      editDepartment();
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
