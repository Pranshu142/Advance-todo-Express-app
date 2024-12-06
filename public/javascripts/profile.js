document.addEventListener("DOMContentLoaded", () => {
  // Get task heading elements
  const taskHeadings = document.querySelectorAll(".task-heading");
  const liveTasksContainer = document.querySelector("#live-task-001");
  const completedTasksContainer = document.querySelector("#Completed-task-002");
  const totalTasksContainer = document.querySelector("#total-task-003");

  // Add click event listeners to each task heading
  taskHeadings.forEach((heading) => {
    heading.addEventListener("click", () => {
      // Remove 'selected' class from all headings
      taskHeadings.forEach((heading) => heading.classList.remove("selected"));

      // Add 'selected' class to the clicked heading
      heading.classList.add("selected");

      // Display tasks based on the selected heading
      const selectedCategory = heading.id;
      displayTasks(selectedCategory);
    });
  });

  // Function to segregate tasks based on their category
  function displayTasks(category) {
    // Hide all task containers initially
    liveTasksContainer.style.display = "none";
    completedTasksContainer.style.display = "none";
    totalTasksContainer.style.display = "none";

    // Show the selected task container
    if (category === "liveTask") {
      liveTasksContainer.style.display = "flex";
    } else if (category === "completedTask") {
      completedTasksContainer.style.display = "flex";
    } else if (category === "totalTask") {
      totalTasksContainer.style.display = "flex";
    }
  }

  // Function to count tasks and update navigation
  function updateTaskCounts() {
    const liveTaskCount =
      liveTasksContainer.querySelectorAll(".task-card").length;
    const completedTaskCount =
      completedTasksContainer.querySelectorAll(".task-card").length;
    const totalTaskCount =
      totalTasksContainer.querySelectorAll(".task-card").length;

    // Update the counts in the navigation
    console.log(document.querySelectorAll("#liveTasks p:nth-child(2)"));
    document
      .querySelector("#liveTasks p:nth-child(2)")
      .querySelector("span").textContent = liveTaskCount;
    document
      .querySelector("#completedTasks p:nth-child(2)")
      .querySelector("span").textContent = completedTaskCount;
    document
      .querySelector("#totalTasks p:nth-child(2)")
      .querySelector("span").textContent = totalTaskCount;
  }

  // Initialize the page
  function initialize() {
    updateTaskCounts(); // Update task counts in the navigation
    displayTasks("totalTask"); // Show all tasks by default
  }

  initialize();
});
