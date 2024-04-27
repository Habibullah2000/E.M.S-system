"use strict";

// const host = "http://localhost:5000/api/v1";

// #######################
// let links = document.getElementsByClassName('link');
let jobData = [];
let job = [];

async function getJobs() {
  try {
    const response = await fetch(`${host}/jobs`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const resData = await response.json();
    jobData = resData;
    // Display owner fields
    // let date = new Date().getFullYear();
    const rows = jobData.map((job, index) => {
      // let dob = new Date(job.dob).getFullYear(); // Access dob for each owner
      // let age = date - dob; // Calculate age for each owner
      return `
        <tr data-id="${job._id}">
          <td>${index + 1}</td>
          <td>${job.job_name}</td>
          <td>
                <a
                  href="#"
                  class="btn btn-sm btn-block btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#jobDetails"
                  id="details-job"
                  >Details
                </a>
            </td>
            <td>
              <a
                href="#"
                class="btn btn-sm btn-block btn-warning"
                data-bs-toggle="modal"
                data-bs-target="#jobEditDetails"
                id="edit-job"
                >Edit</a
              >
            </td>
            <td>
              <a
                href="#"
                id="delete-job"
                class="btn btn-sm btn-block btn-danger"
                >Delete</a
              >
            </td>
        </tr>
      `;
    });
    document.querySelector(".table-body").innerHTML = rows.join("");
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
}

getJobs();

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
async function createJob() {
  // const isValid = validateForm();
  // if (!isValid) {
  //   return;
  // }

  let formdata = new FormData();
  // console.log(formdata.get(jobName));

  formdata.append("job_name", document.getElementById("job_id").value);
  formdata.append("job_description", document.getElementById("des_id").value);
  // console.log(formdata.get(firstName));

  const response = await fetch(`${host}/jobs`, {
    method: "POST",
    body: formdata,
  });
  const resData = await response.json();
  // console.log(resData);
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
document.getElementById("createJob").addEventListener("click", () => {
  // if (validateForm()) {
  createJob(); // Only create job if form is valid
  window.location.reload();
  // }
});

document.getElementById("jobTable").addEventListener("click", async (e) => {
  e.preventDefault();
  let rowId = e.target.parentElement.parentElement.dataset.id;
  let deleteBtnPressed = e.target.id == "delete-job";
  let editBtnPressed = e.target.id == "edit-job";
  let detailsBtnPressed = e.target.id == "details-job";

  if (deleteBtnPressed) {
    if (confirm("Are you sure you want to delete this job?")) {
      fetch(`${host}/jobs/${rowId}`, {
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
    fetch(`${host}/jobs/${rowId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())

      .then((res) => {
        // console.log(res);
        let job = res.job;
        let output = "";
        output += `
        <tr><td>${job.job_name}</td></tr>
        <tr><td><textarea name="" id="" cols="40" rows="3" readonly>${job.job_description}</textarea></td></tr>
          `;
        document.querySelector("table > .detail-body").innerHTML = output;
      });
  }

  if (editBtnPressed) {
    const response = await fetch(`${host}/jobs/${rowId}`);
    const result = await response.json();
    const job = result.job;

    document.getElementById("eJob").value = job.job_name;
    document.getElementById("eDescription").value = job.job_description;

    async function editJob() {
      // Update Job
      let formdata = new FormData();
      formdata.append("job_name", document.getElementById("eJob").value);
      formdata.append(
        "job_description",
        document.getElementById("eDescription").value
      );

      const editResponse = await fetch(`${host}/jobs/${rowId}`, {
        method: "PUT",
        body: formdata,
      });

      const jobResult = await editResponse.json();
      if (response.status === 200) {
        window.location.reload();
      }
    }

    document.getElementById("editJobId").addEventListener("click", () => {
      editJob();
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
