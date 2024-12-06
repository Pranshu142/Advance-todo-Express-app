document.addEventListener("DOMContentLoaded", function () {
  const titleInput = document.getElementById("title-input");
  const taskInput = document.getElementById("task-input");
  const generateTitle = document.getElementById("generate-title");
  const generateTask = document.getElementById("generate-task");
  const taskTitle = document.getElementById("task-title");
  const taskList = document.getElementById("task-list");

  // const titleFlag = true;

  const generateTitleBtn = () => {
    generateTitle.addEventListener("click", () => {
      if (titleInput.value.trim()) {
        taskTitle.querySelector("span").textContent = titleInput.value.trim();
        titleInput.value = "";
        taskTitle.style.borderBottom = "1px solid grey";

        // getElementByClassName("title-btn"). will return a array like structure but not  exactly the array
        // so we need to convert the returned collection to an array by using Array.from() method of the Array class
        // on which the forEach method will be called

        const titleBtn = Array.from(
          document.getElementsByClassName("title-btn")
        );
        titleBtn.forEach((element) => {
          element.style.display = "block";
        });
      } else {
        alert("Please enter a title!");
      }
    });
  };

  const generateTaskListBtn = () => {
    generateTask.addEventListener("click", () => {
      if (taskInput.value.trim()) {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";
        taskItem.style.color = "wheat";

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = taskInput.value;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "checkbox";

        checkbox.addEventListener("change", () => {
          taskText.style.textDecoration = checkbox.checked
            ? "line-through"
            : "none";
          taskItem.style.color = checkbox.checked ? "grey" : "wheat";
        });

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
          taskItem.remove();
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(removeBtn);
        taskList.appendChild(taskItem);
        taskInput.value = "";
        selectedEmoji = ""; // Reset selected emoji after each task addition
      } else {
        alert("Please enter a task!");
      }
    });
  };

  const gnerateEmojiFunc = () => {
    const emojiPickerContainer = document.getElementById(
      "emoji-picker-container"
    );
    const titleInput = document.getElementById("title-input");
    const taskInput = document.getElementById("task-input");

    // let selectedEmoji = ""; // This will hold the chosen emoji
    let currentInput = null; // Track the current input field

    // Initialize Emoji Picker
    const picker = new EmojiMart.Picker({
      data: EmojiMart.data,
      onEmojiSelect: (emoji) => {
        if (currentInput) {
          currentInput.value += emoji.native; // Append emoji to the active input
          emojiPickerContainer.style.display = "none"; // Hide picker after selection
        }
      },
      title: "Pick an Emoji",
      emoji: "point_up",
      theme: "dark",
    });

    // Render emoji picker in the container and hide initially
    emojiPickerContainer.appendChild(picker);
    emojiPickerContainer.style.display = "none";

    // Show emoji picker for the focused input field
    const showEmojiPickerForInput = (inputField) => {
      currentInput = inputField; // Set the current input field
      emojiPickerContainer.style.display = "block";
    };

    // Event listeners to show picker on input focus
    titleInput.addEventListener("focus", () =>
      showEmojiPickerForInput(titleInput)
    );
    taskInput.addEventListener("focus", () =>
      showEmojiPickerForInput(taskInput)
    );

    // Hide emoji picker if clicking outside the inputs and picker
    document.addEventListener("click", (event) => {
      if (
        !emojiPickerContainer.contains(event.target) &&
        event.target !== titleInput &&
        event.target !== taskInput
      ) {
        emojiPickerContainer.style.display = "none";
      }
    });
  };

  const clearTaskBtn = () => {
    const taskClearBtn = document.querySelector("#clear-task");

    taskClearBtn.addEventListener("click", () => {
      taskTitle.querySelector("span").textContent = "";
      taskTitle.style.border = "transparent";
      const titleBtn = Array.from(document.getElementsByClassName("title-btn"));
      titleBtn.forEach((element) => {
        element.style.display = "none";
      });
      const child = Array.from(document.querySelector(".task-item"));
      child.forEach((ele) => {
        taskList.removeChild(ele);
      });
      taskList.innerHTML = "";
    });
  };

  generateTitleBtn();
  generateTaskListBtn();
  gnerateEmojiFunc();
  clearTaskBtn();
});
