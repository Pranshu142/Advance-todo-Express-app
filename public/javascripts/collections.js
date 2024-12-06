document.addEventListener("DOMContentLoaded", () => {
  const taskProgressUpdaterFnc = () => {
    const taskWrappers = document.querySelectorAll(".task-card-wrapper");

    taskWrappers.forEach((wrapper) => {
      const checkboxes = wrapper.querySelectorAll(".task-checkbox");
      const progressCircle = wrapper.querySelector(".progress-circle");
      const progressPercentage = wrapper.querySelector(".progress-percentage");
      const taskKey = wrapper.querySelector(".current-title span").textContent;

      // Load state from localStorage
      const savedState = JSON.parse(localStorage.getItem(taskKey)) || {};

      checkboxes.forEach((checkbox, index) => {
        const label = checkbox.nextElementSibling;

        // Restore checkbox state
        if (savedState[index] !== undefined) {
          checkbox.checked = savedState[index];
          if (checkbox.checked) {
            label.style.textDecoration = "line-through";
            label.style.color = "gray";
          } else {
            label.style.textDecoration = "none";
            label.style.color = "white";
          }
        }
      });

      // Function to update progress
      const updateProgress = () => {
        const totalTasks = checkboxes.length;
        const completedTasks = Array.from(checkboxes).filter(
          (checkbox) => checkbox.checked
        ).length;

        const progress = Math.round((completedTasks / totalTasks) * 100);

        // Update the percentage text
        progressPercentage.textContent = `${progress}%`;

        // Update the circular progress bar
        progressCircle.style.background = `conic-gradient(
          #00ff00 ${progress}%, 
          #121212 ${progress}%, 
          #121212 100%
        )`;

        // If progress is 100%, add a glowing effect
        if (progress === 100) {
          progressCircle.style.boxShadow = "0 12px 30px rgba(0, 255, 0, 0.6)";
          progressCircle.style.animation =
            "green-glow 1.5s infinite ease-in-out";
        } else {
          progressCircle.style.boxShadow = "0 8px 15px rgba(255, 98, 0, 0.4)";
          progressCircle.style.animation = "glow 1.5s infinite ease-in-out";
        }

        // Save the checkbox states to localStorage
        const checkboxStates = Array.from(checkboxes).map(
          (checkbox) => checkbox.checked
        );
        localStorage.setItem(
          taskKey,
          JSON.stringify({ ...checkboxStates, progress })
        );
      };

      // Event listener for each checkbox
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
          const label = e.target.nextElementSibling;

          // Toggle the strike-through and color when checkbox is checked/unchecked
          if (checkbox.checked) {
            label.style.textDecoration = "line-through";
            label.style.color = "gray";
          } else {
            label.style.textDecoration = "none";
            label.style.color = "white";
          }

          // Update progress whenever a checkbox is toggled
          updateProgress();
        });
      });

      // Initialize the progress on load
      updateProgress();
    });
  };

  const dateTimeConfig = () => {
    const dateElements = document.querySelectorAll("#date-time-content");

    dateElements.forEach((el) => {
      const timestamp = el.getAttribute("data-timestamp");

      // Use Day.js to format the timestamp
      const formattedDate = dayjs(timestamp).format(
        "dddd, MMMM Do YYYY, h:mm:ss a"
      );

      el.textContent = formattedDate;
    });
  };

  const taskDateUpdater = () => {
    const now = new Date();
    const currentTime = now.getTime();

    // Calculate the time remaining until midnight
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0
    ).getTime();
    const timeUntilMidnight = midnight - currentTime;

    // Set a timeout to reload the page at midnight
    setTimeout(() => {
      location.reload(); // Reload the page to fetch updated tasks
    }, timeUntilMidnight);
  };

  taskDateUpdater();
  dateTimeConfig();
  taskProgressUpdaterFnc();
});
