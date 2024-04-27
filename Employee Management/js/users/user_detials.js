'use strict';
const upload = document.querySelector('.upload');
const fileInput = upload.querySelector('.file-input');
const img = document.querySelector('.image-preview'); // Assuming you have an <img> element with the class "image-preview"

// Add an event listener for the change event on the file input
fileInput.addEventListener('change', (event) => {
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
upload.addEventListener('click', () => {
  fileInput.click();
});

// ##############

const [url, originId] = document.URL.split('=');
// console.log(originId);
let user;

// edit user data
document.querySelector('#editBtn').addEventListener('click', () =>{
    // console.log(user.last_name);
    document.getElementById('username').value = user.username;
    document.getElementById('email').value = user.email;
    document.getElementById('lastName').value = user.last_name;
    document.getElementById('contact').value = user.contact;
    document.getElementById('address').value = user.address;
    document.getElementById('picture').src = `${host}${user.profile}`;
});


// Cancel user event
document.getElementById('cancel').addEventListener('click', () => {
    cleanInput();
    closeModal();
  });

// Clean input function 
function cleanInput() {
  document.getElementById('username').value = '';
  document.getElementById('email').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('contact').value = '';
  document.getElementById('address').value = '';
  document.getElementById('img').value = '';
}

//   Get User By Id
async function getUserById(id) {
  const response = await fetch(`${host}/users/${id}`);
  const resData = await response.json();
  let output = '';
  user = resData.user;
  if(userP.isAdmin !== true) {
    window.location.href = '/users.htmlz';
  }
    // console.log(user);
  // give the age from date of birth
  const submitDate = new Date(user.updatedAt).toLocaleDateString();
  output += `
  <tr>
  <td>${user.username} ${user.last_name} <span class="prof"><a href="${host}${user.profile}" target="_blank"><img src="${host}${user.profile}" alt="${user.first_name} image"/></a></span></td>
  </tr>
  <tr><td>${user.email}</td></tr>
  <tr><td>${user.contact}</td></tr>
  <tr><td>${user.address}</td></tr>
  <tr><td>${user.isAdmin == true ? "Admin" : "User"}</td></tr>
  <tr><td>${submitDate}</td></tr>
    `;
  document.querySelector('table > .detail-table-body').innerHTML = output;
}

getUserById(originId);

// Form Validation Function
function validateForm() {
  // Get input field values
  const userName = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const address = document.getElementById('address').value.trim();
  // const userType = document.getElementById('userType').value.trim();
  const profile = document.getElementById('img').value.trim();

  // Regular expressions for validation
  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const contactRegex = /^\d{10}$/; // 10-digit phone number
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  const addressRegex = /^[A-Za-z0-9\s]+$/;
  const imgRegex = /\.(png|PNG|jpg|JPG)$/i; // Image file extensions


  // Function to display error messages
  function displayError(inputId, errorMessage) {
    const input = document.getElementById(inputId);
    const small = input.parentElement.querySelector('small');
    small.innerText = errorMessage;
    small.className = 'error';
    input.className = 'error';
    small.style.display = 'block';
  }

  // Clear previous error messages
  const errorMessages = document.querySelectorAll('.error');
  errorMessages.forEach((error) => {
    error.innerText = '';
  });

  // Validate Username
  if (userName === '') {
    displayError('username', 'Username cannot be empty.'); // Display error message
  } else if (!userName.match(nameRegex)) {
    displayError('username', 'Username must contain only letters and spaces.'); // Display error message
  }


  // Validate Last Name
  if (lastName === '') {
    displayError('lastName', 'Last Name cannot be empty.'); // Display error message
  } else if (!lastName.match(nameRegex)) {
    displayError('lastName', 'Last Name must contain only letters and spaces.'); // Display error message
  }

  // Validate Email
  if (email === '') {
    displayError('email', 'Email cannot be empty.'); // Display error message
  } else if (!email.match(emailRegex)) {
    displayError('email', 'Invalid Email.'); // Display error message
  }
  
  // Validate Contact
  if (contact === '') {
    displayError('contact', 'Phone Number cannot be empty.'); // Display error message
  } else if (!contact.match(contactRegex)) {
    displayError('contact', 'Phone Number must contain only numbers.'); // Display error message
  }
  
  // Validate Address
  if (address === '') {
    displayError('address', 'Address cannot be empty.'); // Display error message
  } else if (!address.match(addressRegex)) {
    displayError('address', 'Address must contain only letters, numbers, and spaces.'); // Display error message
  }

  // // Validate User Type
  // if (userType === '') {
  //   displayError('user_type', 'User Type cannot be empty.');
  // }

  // Validate Profile Image
  if (profile === '') {
    displayError('img', 'Profile image cannot be empty.'); // Display error message
  } else if (!profile.match(imgRegex)) {
    displayError('img', 'Profile image must have a valid file extension (png, PNG, jpg, JPG).'); // Display error message
  }

  // Check for any displayed error messages
  const hasErrors = Array.from(errorMessages).some((error) => error.innerText !== '');

  // Display error messages
  if (hasErrors) {
    return false; // Prevent form submission
  }

  // Form is valid, allow submission
  return true;
}


async function updateUserById(id) {
  const isValid = validateForm();
  if (!isValid) {
    return;
  }
  let formdata = new FormData();
  formdata.append("username", document.getElementById('username').value);
  formdata.append("email", document.getElementById('email').value);
  formdata.append("last_name", document.getElementById('lastName').value);
  formdata.append("contact", document.getElementById('contact').value);
  formdata.append("address", document.getElementById('address').value);
  formdata.append("file", document.getElementById('img').files[0]);
  
  // Update tenant
  const response = await fetch(`${host}/users/${id}`, {
    method: 'PUT',
    body: formdata
  })
  const resData = await response.json();
  if(response.status === 200 || response.status === 201) {
    let successMsg = `<span class="notification-icon material-icons-sharp">check_circle</span> ${resData.message}`;
    showToast(successMsg);
    // Close the modal when the form is successfully submitted
    closeModal();
    // Clean input fields
    cleanInput();
    setTimeout(() => {
      window.location.href = `/user_details.html?id=${originId}`;
    }, 2000);
  }else if(response.status === 404 || response.status === 400) {
    let errorMsg = `<span class="notification-icon material-icons-sharp">cancel</span> ${resData.message}`;
    showToast(errorMsg);
  } else if(response.status === 500){
    let warningMsg = `<span class="notification-icon material-icons-sharp">error</span> ${resData.message}`;
    showToast(warningMsg);
  }
}

// Update Tenant event
document.getElementById('editUser').addEventListener('click', () => {
  if (validateForm()) {
  updateUserById(originId); // Only create tenant if form is valid
  }
});

// Delete User
async function deleteUserById(id) {
  const response = await fetch(`${host}/users/${id}`, {
    method: 'DELETE',
    headers: {
        'Content-type': 'application/json'
    },
  })
  const resData = await response.json();
  if(response.status === 200 || response.status === 201) {
    let successMsg = `<span class="notification-icon material-icons-sharp">check_circle</span> ${resData.message}`;
    showToast(successMsg);
  }else if(response.status === 404 || response.status === 400) {
    let errorMsg = `<span class="notification-icon material-icons-sharp">cancel</span> ${resData.message}`;
    showToast(errorMsg);
  } else if(response.status === 500){
    let warningMsg = `<span class="notification-icon material-icons-sharp">error</span> ${resData.message}`;
    showToast(warningMsg);
  }
}
  
  // delete tenant event click
document.querySelector('#deleteBtn').addEventListener('click', () =>{
  const confirmation = confirm('Are you sure You want to delete User');
  if(confirmation == true) {
    deleteUserById(user._id);
    setTimeout(() => {
      window.location.href= '/users.html';
    }, 2000);
  } 
});


// toast box
let toastBox = document.getElementById('toast-box');
// Show toast function
function showToast(msg) {
  let toast = document.createElement('div');
  toast.classList.add('toast');
  toast.innerHTML = msg;
  toastBox.appendChild(toast);

  if(msg.includes('Successfully')) {
      toast.classList.add('success');
  } else if(msg.includes('already')) {
        toast.classList.add('warning');
  } else if(msg.includes('Error') || msg.includes('Not Found')) {
      toast.classList.add('error');
  }
  
  setTimeout(() => {
      toast.remove();
  }, 2000);
}