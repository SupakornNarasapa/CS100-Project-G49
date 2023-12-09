 const config = {
    backendUrl: "http://localhost:8000/", // Default backend URL
  };
  const port = 8000;

  
// Constants for error messages
const ERROR_MESSAGES = {
  engfullName: "Please enter both your Firstname and Lastname using only English letters.",
  thaifullName: "Please enter both your Firstname and Lastname using only Thai letters.",
  studentID: "Please enter a 10-digit Student ID.",
  email: "Please provide a valid university email in the format 'xxx.yyy@dome.tu.ac.th'.",
  dateOrder: "End datetime should be after the start datetime.",
};

// Function to display error messages and add red border
function displayError(element, message) {
  const errorElement = document.getElementById(element + "Error");
  errorElement.textContent = message;
  document.getElementById(element).style.border = "2px solid red";
}

function clearError(element) {
  const errorElement = document.getElementById(element + "Error");
  errorElement.textContent = "";
  document.getElementById(element).style.border = "";
}

function validateEngName() {
  const engfullnameInput = document.getElementById("engfullname");
  const names = engfullnameInput.value.trim().split(" ");

  const namePattern = /^[a-zA-Z]+$/;

  if (names.length !== 2 || !namePattern.test(names[0]) || !namePattern.test(names[1])) {
    displayError("engfullname", ERROR_MESSAGES.engfullName);
    engfullnameInput.classList.add("error-border");
    return false;
  } else {
    clearError("engfullname");
    engfullnameInput.classList.remove("error-border");
  }
  return true;
}
function validateThaiName() {
  const thaifullnameInput = document.getElementById("thaifullname");
  const names = thaifullnameInput.value.trim().split(" ");

  const namePattern = /^[a-zA-Z\u0E00-\u0E7F]+$/;

  if (names.length !== 2 || !namePattern.test(names[0]) || !namePattern.test(names[1])) {
    displayError("thaifullname", ERROR_MESSAGES.thaifullName);
    thaifullnameInput.classList.add("error-border");
    return false;
  } else {
    clearError("thaifullname");
    thaifullnameInput.classList.remove("error-border");
  }
  return true;
}

function validateStudentID() {
  const studentIDInput = document.getElementById("studentID");
  const studentIDPattern = /^\d{10}$/;

  if (!studentIDPattern.test(studentIDInput.value)) {
    displayError("studentID", ERROR_MESSAGES.studentID);
    return false;
  } else {
    clearError("studentID");
  }
  return true;
}

function validateEmail() {
  const emailInput = document.getElementById("email");
  const emailPattern = /^.+@dome\.tu\.ac\.th$/;

  if (!emailPattern.test(emailInput.value)) {
    displayError("email", ERROR_MESSAGES.email);
    return false;
  } else {
    clearError("email");
  }
  return true;
}

function validateAndDisableFutureDates() {
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  const currentDate = new Date();
  const minDate = currentDate.toISOString().split("T")[0];

  startDateInput.setAttribute("min", minDate);
  endDateInput.setAttribute("min", minDate);

  clearError("startDate");
  clearError("endDate");
}

function blankOutFutureDates() {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("startDate").setAttribute("min", today);
  document.getElementById("endDate").setAttribute("min", today);
}

function displaySubmittedData(data) {
  const submittedDataContainer = document.getElementById("submittedData");

  submittedDataContainer.innerHTML = "submittedData";

  const flexContainer = document.createElement("div");
  flexContainer.classList.add("submitted-data-container");

  for (const [key, value] of Object.entries(data)) {
    const flexItem = document.createElement("div");
    flexItem.classList.add("flex-item");

    const keyElement = document.createElement("span");
    keyElement.classList.add("flex-key");
    keyElement.textContent = key + ": ";

    const valueElement = document.createElement("span");
    valueElement.classList.add("flex-value");
    valueElement.textContent = value;

    flexItem.appendChild(keyElement);
    flexItem.appendChild(valueElement);
    flexContainer.appendChild(flexItem);
  }

  submittedDataContainer.appendChild(flexContainer);
}

function validateAllFieldsFilled() {
  const formInputs = document.querySelectorAll("#myForm input, #myForm select");

  for (const input of formInputs) {
    if (!input.value.trim()) {
      alert("Please fill in all fields before submitting the form.");
      return false;
    }
  }

  return true;
}

async function fetchActivityTypes() {
  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/getactivityType`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch activity types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching activity types:", error);
    return [];
  }
}
async function fetchFaculty() {
  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/getfaculty`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch faculty types.");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching faculty types:", error);
    return [];
  }
}
function populateFaculty(faculty) {
  const facultySelect = document.getElementById("faculty");

  for (const type of faculty) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}
function populateActivityTypes(activityTypes) {
  const activityTypeSelect = document.getElementById("activityType");

  for (const type of activityTypes) {
    const option = document.createElement("option");
    option.value = type.id;
    option.textContent = type.value;
    activityTypeSelect.appendChild(option);
  }
}
// Event listener when the page content has finished loading
document.addEventListener("DOMContentLoaded", async () => {
  const activityTypes = await fetchActivityTypes();
  populateActivityTypes(activityTypes);
  const faculty = await fetchFaculty();
  populateFaculty(faculty);
});

async function submitForm(event) {
  event.preventDefault();

  if (!validateAllFieldsFilled()) {
    return;
  }

  if (!validateEngName() || !validateThaiName() || !validateStudentID() || !validateEmail()) {
    return;
  }

  const startDateInput = document.getElementById("startDate").value;
  const endDateInput = document.getElementById("endDate").value;
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  if (endDate <= startDate) {
    alert(ERROR_MESSAGES.dateOrder);
    return;
  }

  const formData = new FormData(event.target);
  const data = {
    eng_first_name: formData.get("engfullname").split(" ")[0],
    eng_last_name: formData.get("engfullname").split(" ")[1],
    thai_first_name: formData.get("thaifullname").split(" ")[0],
    thai_last_name: formData.get("thaifullname").split(" ")[1],
    faculty_id: parseInt(formData.get("faculty")),
    student_id: parseInt(formData.get("studentID")),
    email: formData.get("email"),
    title: formData.get("workTitle"),
    type_of_work_id: parseInt(formData.get("activityType")),
    academic_year: parseInt(formData.get("academicYear")) - 543,
    semester: parseInt(formData.get("semester")),
    start_date: formData.get("startDate"),
    end_date: formData.get("endDate"),
    location: formData.get("location"),
    description: formData.get("description"),
  };

  console.log(data);

  try {
    const response = await fetch(`http://${window.location.hostname}:${port}/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log("Form data submitted successfully!");

      displaySubmittedData(responseData.data);

      const formattedData = Object.entries(responseData.data)
        .map(([key, value]) => `"${key}": "${value}"`)
        .join("\n");

      alert(responseData.message + "\n" + formattedData);

      document.getElementById("myForm").reset();
    } else {
      console.error("Failed to submit form data.");

      alert("Failed to submit form data. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred while submitting form data:", error);
  }
};

document.getElementById("myForm").addEventListener("submit", submitForm);
document.getElementById("engfullname").addEventListener("input", validateEngName);
document.getElementById("thaifullname").addEventListener("input", validateThaiName);
document.getElementById("studentID").addEventListener("input", validateStudentID);
document.getElementById("email").addEventListener("input", validateEmail);


document.addEventListener("DOMContentLoaded", validateAndDisableFutureDates);

document.addEventListener("DOMContentLoaded", () => {blankOutFutureDates();});

document.addEventListener('DOMContentLoaded', function () {
  // Animated effect - fade in the whole page
  document.body.style.opacity = 0;
  setTimeout(function () {
    document.body.style.transition = 'opacity 1s';
    document.body.style.opacity = 1;
  }, 0);
});
  