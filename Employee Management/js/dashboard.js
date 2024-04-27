// dashboard.js
// let host = "http://localhost:5000/api/v1";
document.addEventListener("DOMContentLoaded", function () {
  fetchEmployeeData();
  fetchJobData();
});

async function fetchEmployeeData() {
  // Fetch data from the backend API
  const response = await fetch(`${host}/employees`);
  const result = await response.json();
  // console.log(result.length);
  document.getElementById("employeeNumber").innerText = result.length;
}

async function fetchJobData() {
  // Fetch data from the backend API
  const response = await fetch(`${host}/jobs`);
  const result = await response.json();
  // console.log(result.length);
  document.getElementById("jobsNumber").innerText = result.length;

  const limitJob = result.slice(4);
  const rows = limitJob.map((job, index) => {
    // let dob = new Date(job.dob).getFullYear(); // Access dob for each owner
    // let age = date - dob; // Calculate age for each owner
    return `
        <tr data-id="${job._id}">
          <td>${index + 1}</td>
          <td>${job.job_name}</td>
          <td>${job.job_description}</td>
        </tr>
      `;
  });
  document.querySelector(".table-body").innerHTML = rows.join("");
}
