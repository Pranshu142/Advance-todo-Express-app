document.addEventListener("DOMContentLoaded", () => {
  /**
   * Updates the progress and status of tasks based on checkbox states.
   * Also manages localStorage and backend updates.
   */
  const updateTaskProgress = (wrapper) => {
    const checkboxes = wrapper.querySelectorAll(".task-checkbox");
    const progressCircle = wrapper.querySelector(".progress-circle");
    const progressPercentage = wrapper.querySelector(".progress-percentage");
    const taskKey = wrapper.querySelector(".current-title span").textContent;

    // Calculate progress
    const totalTasks = checkboxes.length;
    const completedTasks = Array.from(checkboxes).filter(
      (checkbox) => checkbox.checked
    ).length;

    const progress = Math.round((completedTasks / totalTasks) * 100);

    // Update progress circle and percentage text
    progressPercentage.textContent = `${progress}%`;
    progressCircle.style.background = `conic-gradient(
      #00ff00 ${progress}%, 
      #121212 ${progress}%, 
      #121212 100%
    )`;

    // Apply glowing effect if progress is 100%
    if (progress === 100) {
      progressCircle.style.boxShadow = "0 12px 30px rgba(0, 255, 0, 0.6)";
      progressCircle.style.animation = "green-glow 1.5s infinite ease-in-out";
    } else {
      progressCircle.style.boxShadow = "0 8px 15px rgba(255, 98, 0, 0.4)";
      progressCircle.style.animation = "glow 1.5s infinite ease-in-out";
    }

    // Update task status
    const allCompleted = completedTasks === totalTasks;
    wrapper.setAttribute("data-status", allCompleted ? "complete" : "live");

    // Save progress and checkbox states in localStorage
    const checkboxStates = Array.from(checkboxes).map(
      (checkbox) => checkbox.checked
    );
    localStorage.setItem(
      taskKey,
      JSON.stringify({ states: checkboxStates, progress })
    );

    // Send status update to the server
    const taskId = wrapper.getAttribute("data-task-id");
    if (taskId) {
      fetch(`/users/tasks/${taskId}/updateStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: allCompleted ? "complete" : "live",
        }),
      }).catch((error) =>
        console.error("Error updating task status on server:", error)
      );
    }
  };

  /**
   * Restores saved state (checkbox states and progress) from localStorage.
   */
  const restoreTaskState = (wrapper) => {
    const checkboxes = wrapper.querySelectorAll(".task-checkbox");
    const taskKey = wrapper.querySelector(".current-title span").textContent;
    const savedState = JSON.parse(localStorage.getItem(taskKey)) || {};

    checkboxes.forEach((checkbox, index) => {
      const label = checkbox.nextElementSibling;
      checkbox.checked = savedState.states ? savedState.states[index] : false;

      // Apply styling for checked/unchecked state
      if (checkbox.checked) {
        label.style.textDecoration = "line-through";
        label.style.color = "gray";
      } else {
        label.style.textDecoration = "none";
        label.style.color = "white";
      }
    });

    // Update progress based on restored state
    updateTaskProgress(wrapper);
  };

  /**
   * Attaches event listeners to checkboxes to handle changes.
   */
  const attachCheckboxListeners = (wrapper) => {
    const checkboxes = wrapper.querySelectorAll(".task-checkbox");

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const label = checkbox.nextElementSibling;

        // Update label styling
        if (checkbox.checked) {
          label.style.textDecoration = "line-through";
          label.style.color = "gray";
        } else {
          label.style.textDecoration = "none";
          label.style.color = "white";
        }

        // Update progress and status
        updateTaskProgress(wrapper);
      });
    });
  };

  /**
   * Configures the date and time display using Day.js.
   */
  const configureDateTime = () => {
    const dateElements = document.querySelectorAll("#date-time-content");

    dateElements.forEach((el) => {
      const timestamp = el.getAttribute("data-timestamp");
      const formattedDate = dayjs(timestamp).format(
        "dddd, MMMM Do YYYY, h:mm:ss a"
      );
      el.textContent = formattedDate;
    });
  };

  /**
   * Sets a timeout to reload the page at midnight.
   */
  const setMidnightReload = () => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    ).getTime();
    const timeUntilMidnight = midnight - now.getTime();

    setTimeout(() => {
      location.reload();
    }, timeUntilMidnight);
  };

  /**
   * Updates the indicator tag for each task based on its date.
   */
  const updateTaskIndicators = () => {
    const taskWrappers = document.querySelectorAll(".task-card-wrapper");

    taskWrappers.forEach((wrapper) => {
      const timestamp = wrapper
        .querySelector("#date-time-content")
        .getAttribute("data-timestamp");
      const taskDate = dayjs(timestamp);
      const today = dayjs().startOf("day");

      const indicatorTag = wrapper.querySelector("#indicator-tag h3 span");
      const indicatorContainer = wrapper.querySelector("#indicator-tag");

      if (taskDate.isSame(today, "day")) {
        indicatorTag.textContent = "Live Task";
        indicatorContainer.style.backgroundColor = "cyan";
      } else {
        indicatorTag.textContent = "Previous Task";
        indicatorContainer.style.backgroundColor = "orangered";
      }
    });
  };

  /**
   * Initializes all tasks by restoring state and attaching event listeners.
   */
  const initializeTasks = () => {
    const taskWrappers = document.querySelectorAll(".task-card-wrapper");

    taskWrappers.forEach((wrapper) => {
      restoreTaskState(wrapper);
      attachCheckboxListeners(wrapper);
    });
  };

  // Initialize the application
  configureDateTime();
  setMidnightReload();
  updateTaskIndicators();
  initializeTasks();
});
