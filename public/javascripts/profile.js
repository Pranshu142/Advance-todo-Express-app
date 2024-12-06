document.addEventListener("DOMContentLoaded", () => {
    // Get all task heading elements
    const taskHeadings = document.querySelectorAll(".task-heading");

    // Add click event listeners to each task heading
    taskHeadings.forEach((heading) => {
        heading.addEventListener("click", () => {
            // Remove 'selected' class from all headings
            taskHeadings.forEach((heading) => heading.classList.remove("selected"));

            // Add 'selected' class to the clicked heading
            heading.classList.add("selected");

            // Optional: Display relevant tasks based on selected heading
            const selectedCategory = heading.id;
            displayTasks(selectedCategory);
        });
    });
});

// Function to display tasks based on selected category
function displayTasks(category) {
    const allTaskCards = document.querySelectorAll(".task-card");

    allTaskCards.forEach((card) => {
        if (category === "totalTask") {
            card.style.display = "block"; // Show all tasks if "Total" is selected
        } else if (category === "liveTask" && card.classList.contains("live")) {
            card.style.display = "block"; // Show only live tasks
        } else if (category === "completedTask" && card.classList.contains("completed")) {
            card.style.display = "block"; // Show only completed tasks
        } else {
            card.style.display = "none"; // Hide tasks that don't match
        }
    });
}
