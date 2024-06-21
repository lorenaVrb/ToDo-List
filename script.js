const datesContainer = document.getElementById("dates");
const selectedDateInput = document.getElementById("selectedDateInput");

const numberOfDates = 20; // Total number of dates to display
const currentDate = new Date();

// Create date elements for previous 10 days
for (let i = 10; i > 0; i--) {
  const date = new Date(currentDate);
  date.setDate(currentDate.getDate() - i);
  const dateElement = createDateElement(date);
  datesContainer.appendChild(dateElement);
}

// Create date elements for current and next 10 days
for (let i = 0; i <= 10; i++) {
  const date = new Date(currentDate);
  date.setDate(currentDate.getDate() + i);
  const dateElement = createDateElement(date);
  datesContainer.appendChild(dateElement);
}

// Function to create date element
function createDateElement(date) {
  const dateElement = document.createElement("div");
  // Format date to display only day and month
  const formattedDate = date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  });
  dateElement.textContent = formattedDate;
  dateElement.dataset.date = date.toISOString().split("T")[0]; // Store the full date
  dateElement.classList.add("date"); // Add class to style date elements
  // Event listener for date selection
  dateElement.addEventListener("click", () => {
    // Remove 'selected' class from all date elements
    const allDateElements = document.querySelectorAll(".date");
    allDateElements.forEach((element) => {
      element.classList.remove("selected");
    });
    // Add 'selected' class to the clicked date element
    dateElement.classList.add("selected");
    // Update the hidden input with the selected date
    selectedDateInput.value = formattedDate; 
    // Load tasks for the selected date
    loadTasks();
  });
  return dateElement;
}

// Scroll to today's date
const todayIndex = Math.floor(numberOfDates / 2); // Assuming current date is in the middle
const todayDateElement = datesContainer.children[todayIndex];
todayDateElement.scrollIntoView({
  behavior: "smooth",
  block: "nearest",
  inline: "center",
});

// Function to load tasks from local storage
function loadTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = ""; // Clear existing tasks
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const selectedDate = selectedDateInput.value;

  tasks.forEach(function (task) {
    if (task.date === selectedDate) {
      const newTask = document.createElement("li");
      newTask.className = "task-item";
      if (task.completed) {
        newTask.classList.add("completed");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", function () {
        newTask.classList.toggle("completed");
        saveTasks();
      });

      const label = document.createElement("label");
      label.textContent = task.text;
      label.addEventListener("click", function () {
        label.contentEditable = true;
        label.focus();
      });

      label.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
          label.contentEditable = false;
          saveTasks();
        }
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "x";
      deleteButton.addEventListener("click", function () {
        newTask.remove();
        saveTasks();
      });

      newTask.appendChild(checkbox);
      newTask.appendChild(label);
      newTask.appendChild(deleteButton);
      taskList.appendChild(newTask);
    }
  });
}

// Function to save tasks to local storage
function saveTasks() {
  const taskList = document.getElementById("taskList");
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const selectedDate = selectedDateInput.value;

  // Filter out tasks for the current selected date
  const filteredTasks = tasks.filter((task) => task.date !== selectedDate);

  taskList.querySelectorAll("li").forEach(function (taskItem) {
    const label = taskItem.querySelector("label");
    const checkbox = taskItem.querySelector("input[type='checkbox']");

    filteredTasks.push({
      text: label.textContent,
      date: selectedDate,
      completed: checkbox.checked
    });
  });

  localStorage.setItem("tasks", JSON.stringify(filteredTasks));
}

// Function to add a new task
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  const selectedDate = selectedDateInput.value;

  if (taskText !== "" && selectedDate !== "") {
    const taskList = document.getElementById("taskList");

    const newTask = document.createElement("li");
    newTask.className = "task-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", function () {
      newTask.classList.toggle("completed");
      saveTasks();
    });

    const label = document.createElement("label");
    label.textContent = taskText;
    label.addEventListener("click", function () {
      label.contentEditable = true;
      label.focus();
    });

    label.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        label.contentEditable = false;
        saveTasks();
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", function () {
      newTask.remove();
      saveTasks();
    });

    newTask.appendChild(checkbox);
    newTask.appendChild(label);
    newTask.appendChild(deleteButton);
    taskList.appendChild(newTask);

    // Save tasks to local storage
    saveTasks();

    // Clear input after adding task
    taskInput.value = "";
  }
}

// Add event listener to input field to add task on pressing Enter key
document
  .getElementById("taskInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

// Load tasks from local storage when the page loads
window.addEventListener("load", loadTasks);
