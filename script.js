// Get elements from HTML

const form = document.getElementById("deadlineForm");
const taskInput = document.getElementById("task");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");

const deadlineList = document.getElementById("deadlineList");
const filter = document.getElementById("filter");

const totalCount = document.getElementById("totalCount");
const upcomingCount = document.getElementById("upcomingCount");
const overdueCount = document.getElementById("overdueCount");


// Get saved deadlines from browser

let deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];


// Add new deadline

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const deadline = {
        id: Date.now(),
        task: taskInput.value,
        date: dateInput.value,
        type: typeInput.value
    };

    deadlines.push(deadline);

    // Save to browser
    localStorage.setItem("deadlines", JSON.stringify(deadlines));

    // Clear form
    form.reset();

    // Display deadlines
    displayDeadlines();
});


// Display deadlines

function displayDeadlines() {

    deadlineList.innerHTML = "";

    let selectedFilter = filter.value;

    let filteredDeadlines = deadlines;

    if (selectedFilter !== "All") {

        filteredDeadlines = deadlines.filter(function(deadline) {
            return deadline.type === selectedFilter;
        });

    }


    // Sort deadlines by date

    filteredDeadlines.sort(function(a, b) {

        return new Date(a.date) - new Date(b.date);

    });


    // If there are no deadlines

    if (filteredDeadlines.length === 0) {

        deadlineList.innerHTML = `
            <div class="empty">
                No deadlines found 🎉
            </div>
        `;

    }


    // Create deadline cards

    filteredDeadlines.forEach(function(deadline) {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(deadline.date);
        dueDate.setHours(0, 0, 0, 0);


        let statusText;
        let statusClass;


        if (dueDate < today) {

            statusText = "Overdue";
            statusClass = "overdue";

        } else {

            statusText = "Upcoming";
            statusClass = "upcoming";

        }


        const card = document.createElement("div");

        card.className = "deadline-card";

        card.innerHTML = `

            <div class="deadline-info">

                <h3>${deadline.task}</h3>

                <p>
                    📅 Due: ${formatDate(deadline.date)}
                </p>

                <span class="badge">
                    ${deadline.type}
                </span>

            </div>


            <div>

                <span class="status ${statusClass}">
                    ${statusText}
                </span>

                <button 
                    class="delete-btn"
                    onclick="deleteDeadline(${deadline.id})"
                >
                    Delete
                </button>

            </div>

        `;


        deadlineList.appendChild(card);

    });


    updateStatistics();

}


// Format date

function formatDate(date) {

    const dateObject = new Date(date);

    return dateObject.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


// Delete deadline

function deleteDeadline(id) {

    deadlines = deadlines.filter(function(deadline) {

        return deadline.id !== id;

    });


    localStorage.setItem(
        "deadlines",
        JSON.stringify(deadlines)
    );


    displayDeadlines();

}


// Update statistics

function updateStatistics() {

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    let upcoming = 0;
    let overdue = 0;


    deadlines.forEach(function(deadline) {

        const dueDate = new Date(deadline.date);

        dueDate.setHours(0, 0, 0, 0);


        if (dueDate < today) {

            overdue++;

        } else {

            upcoming++;

        }

    });


    totalCount.textContent = deadlines.length;

    upcomingCount.textContent = upcoming;

    overdueCount.textContent = overdue;

}


// Filter deadlines

filter.addEventListener("change", function() {

    displayDeadlines();

});


// Display saved deadlines when page opens

displayDeadlines();