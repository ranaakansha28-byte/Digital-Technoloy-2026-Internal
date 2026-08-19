/* =========================================
   PAGE 1 - GET STARTED
========================================= */

const startButton = document.getElementById("startButton");

if (startButton) {

    startButton.addEventListener("click", function () {

        // Add zoom/click animation
        startButton.classList.add("clicked");

        // Remove animation after 200ms
        setTimeout(function () {

            startButton.classList.remove("clicked");

        }, 200);

        // Move to the main working page
        setTimeout(function () {

            window.location.href = "page2.html";

        }, 200);

    });

}

/* =========================================
   PAGE 2 - EXERCISE TIMER
========================================= */

const exerciseDisplay =
    document.getElementById("exerciseDisplay");

const startExercise =
    document.getElementById("startExercise");

const exerciseOptions =
    document.querySelectorAll(".exercise-option");


let exerciseTotalSeconds = 0;
let exerciseRemainingSeconds = 0;

let exerciseInterval = null;

let exerciseRunning = false;
let exercisePaused = false;


/* =========================================
   SELECT EXERCISE TIME
========================================= */

exerciseOptions.forEach(function (button) {

    button.addEventListener("click", function () {

        /* Do not change time while exercise is running */
        if (exerciseRunning) {
            return;
        }

        /* Remove previous selection */
        exerciseOptions.forEach(function (otherButton) {
            otherButton.classList.remove("selected");
        });

        /* Select this button */
        this.classList.add("selected");

        const selectedTime =
            this.dataset.minutes;


        /* OTHER OPTION */

        if (selectedTime === "other") {

            const customTime =
                prompt("Enter your exercise time in minutes:");

            if (
                customTime !== null &&
                customTime !== "" &&
                !isNaN(customTime) &&
                Number(customTime) > 0
            ) {

                exerciseTotalSeconds =
                    Number(customTime) * 60;

                exerciseRemainingSeconds =
                    exerciseTotalSeconds;

                updateExerciseDisplay();

            }

            return;
        }


        /* NORMAL OPTIONS */

        exerciseTotalSeconds =
            Number(selectedTime) * 60;

        exerciseRemainingSeconds =
            exerciseTotalSeconds;

        updateExerciseDisplay();

        /* Reset button to START */
        exercisePaused = false;

        startExercise.textContent = "START";

    });

});


/* =========================================
   START / STOP / RESUME EXERCISE
========================================= */

if (startExercise) {

    startExercise.addEventListener("click", function () {


        /* ---------------------------------
           START EXERCISE
        --------------------------------- */

        if (!exerciseRunning && !exercisePaused) {

            if (exerciseRemainingSeconds <= 0) {

                alert("Please select an exercise time first.");

                return;
            }

            exerciseRunning = true;
            exercisePaused = false;

            startExercise.textContent = "STOP";

            startExercise.classList.add("timer-active");

            startExerciseTimer();

            return;
        }


        /* ---------------------------------
           STOP / PAUSE EXERCISE
        --------------------------------- */

        if (exerciseRunning) {

            clearInterval(exerciseInterval);

            exerciseRunning = false;
            exercisePaused = true;

            startExercise.textContent = "RESUME";

            return;
        }


        /* ---------------------------------
           RESUME EXERCISE
        --------------------------------- */

        if (exercisePaused) {

            exerciseRunning = true;
            exercisePaused = false;

            startExercise.textContent = "STOP";

            startExerciseTimer();

        }

    });

}


/* =========================================
   EXERCISE COUNTDOWN
========================================= */

function startExerciseTimer() {

    clearInterval(exerciseInterval);

    exerciseInterval = setInterval(function () {

        if (exerciseRemainingSeconds > 0) {

            exerciseRemainingSeconds--;

            updateExerciseDisplay();

        }


        /* Exercise finished */

        if (exerciseRemainingSeconds <= 0) {

            clearInterval(exerciseInterval);

            exerciseRunning = false;
            exercisePaused = false;

            startExercise.textContent = "START";

            startExercise.classList.remove("timer-active");

            recordCompletedWorkout();

        }

    }, 1000);

}

/* =========================================
   RECORD COMPLETED WORKOUT
========================================= */

function recordCompletedWorkout() {

    /* Work out how many minutes were completed */
    const completedMinutes =
        Math.floor(exerciseTotalSeconds / 60);

    if (completedMinutes <= 0) {
        return;
    }

    /* Find today's day */
    const today = new Date();

    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];

    const todayName = days[today.getDay()];

    /* Get saved progress */
    let exerciseData =
        JSON.parse(localStorage.getItem("exerciseData")) || {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0
        };

    /* Add completed exercise time */
    exerciseData[todayName] += completedMinutes;

    /* Save the progress */
    localStorage.setItem(
        "exerciseData",
        JSON.stringify(exerciseData)
    );

    /* Update the progress bars */
    updateProgressBars(exerciseData);
}


/* =========================================
   UPDATE PROGRESS BARS
========================================= */

function updateProgressBars(exerciseData) {

    const dailyGoal = 90;

    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ];

    days.forEach(function (day) {

        const bar =
            document.getElementById("bar-" + day);

        if (!bar) {
            return;
        }

        const percentage =
            Math.min(
                (exerciseData[day] / dailyGoal) * 100,
                100
            );

        bar.style.height = percentage + "%";
    });
}

updateProgressBars(
    JSON.parse(localStorage.getItem("exerciseData")) || {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
    }
);

/* =========================================
   UPDATE EXERCISE AVERAGES
========================================= */

function updateExerciseAverages(exerciseData) {

    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ];

    /* Find today's day */
    const today = new Date();
    const todayName = days[
        today.getDay() === 0 ? 6 : today.getDay() - 1
    ];

    /* Exercise completed today */
    const dailyTotal = exerciseData[todayName];

    /* Calculate total exercise this week */
    let weeklyTotal = 0;

    days.forEach(function(day) {
        weeklyTotal += exerciseData[day];
    });

    /* Weekly average per day */
    const weeklyAverage =
        weeklyTotal / 7;

    /* Monthly average per day */
    const monthlyAverage =
        (weeklyTotal * 4) / 30;

    /* Find the HTML elements */
    const dailyElement =
        document.getElementById("dailyAverage");

    const weeklyElement =
        document.getElementById("weeklyAverage");

    const monthlyElement =
        document.getElementById("monthlyAverage");

    /* Update the text */
    if (dailyElement) {
        dailyElement.textContent =
            "Daily average: " +
            Math.round(dailyTotal) +
            " min";
    }

    if (weeklyElement) {
        weeklyElement.textContent =
            "Weekly average: " +
            Math.round(weeklyAverage) +
            " min";
    }

    if (monthlyElement) {
        monthlyElement.textContent =
            "Monthly average: " +
            Math.round(monthlyAverage) +
            " min";
    }
}
   

/* =========================================
LOAD EXERCISE DATA
========================================= */

const exerciseData =
    JSON.parse(localStorage.getItem("exerciseData")) || {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        sunday: 0
    };

updateExerciseAverages(exerciseData);

    
/* =========================================
   UPDATE EXERCISE DISPLAY
========================================= */

function updateExerciseDisplay() {

    if (!exerciseDisplay) {
        return;
    }

    const minutes =
        Math.floor(exerciseRemainingSeconds / 60);

    const seconds =
        exerciseRemainingSeconds % 60;


    exerciseDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

}



/* =========================================
   BREAK TIMER
========================================= */

const breakOptions =
    document.querySelectorAll(".break-option");

const stopBreak =
    document.getElementById("stopBreak");

const resumeBreak =
    document.getElementById("resumeBreak");

const breakDisplay =
    document.getElementById("breakDisplay");


let breakRemainingSeconds = 0;
let breakInterval = null;

let breakRunning = false;
let breakPaused = false;


/* =========================================
   SELECT BREAK TIME
========================================= */

breakOptions.forEach(function (button) {

    button.addEventListener("click", function () {

        /* Don't change break while running */
        if (breakRunning) {
            return;
        }


        breakOptions.forEach(function (otherButton) {

            otherButton.classList.remove("selected");

        });


        this.classList.add("selected");


        const breakMinutes =
            Number(this.dataset.break);


        breakRemainingSeconds =
            breakMinutes * 60;


        breakPaused = false;
        breakRunning = true;


        updateBreakDisplay();

        startBreakTimer();

        updateBreakButtons();

    });

});


/* =========================================
   BREAK STOP BUTTON
========================================= */

if (stopBreak) {

    stopBreak.addEventListener("click", function () {

        if (!breakRunning) {
            return;
        }


        clearInterval(breakInterval);

        breakRunning = false;
        breakPaused = true;

        updateBreakButtons();

    });

}


/* =========================================
   BREAK RESUME BUTTON
========================================= */

if (resumeBreak) {

    resumeBreak.addEventListener("click", function () {

        if (!breakPaused) {
            return;
        }


        breakRunning = true;
        breakPaused = false;

        startBreakTimer();

        updateBreakButtons();

    });

}


/* =========================================
   START BREAK COUNTDOWN
========================================= */

function startBreakTimer() {

    clearInterval(breakInterval);


    breakInterval = setInterval(function () {

        if (breakRemainingSeconds > 0) {

            breakRemainingSeconds--;

            updateBreakDisplay();

        }


        /* Break finished */

        if (breakRemainingSeconds <= 0) {

            clearInterval(breakInterval);

            breakRunning = false;
            breakPaused = false;

            breakOptions.forEach(function (button) {

                button.classList.remove("selected");

            });

            breakDisplay.textContent = "00:00";

            updateBreakButtons();

        }

    }, 1000);

}


/* =========================================
   UPDATE BREAK DISPLAY
========================================= */

function updateBreakDisplay() {

    if (!breakDisplay) {
        return;
    }


    const minutes =
        Math.floor(breakRemainingSeconds / 60);

    const seconds =
        breakRemainingSeconds % 60;


    breakDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");

}


/* =========================================
   UPDATE BREAK BUTTONS
========================================= */

function updateBreakButtons() {

    if (stopBreak) {

        stopBreak.style.display =
            breakRunning ? "block" : "none";

    }


    if (resumeBreak) {

        resumeBreak.style.display =
            breakPaused ? "block" : "none";

    }

}






   

(function () {

    const cardsTrack =
        document.getElementById("page3CardsTrack");

    const previousButton =
        document.getElementById("page3Previous");

    const nextButton =
        document.getElementById("page3Next");

    const cards =
        document.querySelectorAll(".page3-card");


    const activityInput =
        document.getElementById("page3ActivityInput");

    const saveButton =
        document.getElementById("page3SaveButton");

    const saveMessage =
        document.getElementById("page3SaveMessage");


    let currentPosition = 0;

    const totalCards = cards.length;

    const visibleCards = 3;

    const cardWidth = 68;

    const cardGap = 9;

    const moveAmount =
        cardWidth + cardGap;


    function moveCards() {

        cardsTrack.style.transform =
            `translateX(-${currentPosition * moveAmount}px)`;

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                if (
                    currentPosition <
                    totalCards - visibleCards
                ) {

                    currentPosition++;

                    moveCards();

                }

            }
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            function () {

                if (currentPosition > 0) {

                    currentPosition--;

                    moveCards();

                }

            }
        );

    }


    cards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                card.classList.toggle("flipped");

            }
        );

    });



    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function () {


                /* Get activity */

                const activity =
                    activityInput.value.trim();



                if (activity === "") {

                    saveMessage.textContent =
                        "Please write something first.";

                    return;

                }



                let savedActivities =
                    JSON.parse(
                        localStorage.getItem(
                            "activityLog"
                        )
                    ) || [];


                savedActivities.push({

                    text: activity,

                    date:
                        new Date()
                        .toLocaleDateString(),

                    time:
                        new Date()
                        .toLocaleTimeString()

                });



                localStorage.setItem(
                    "activityLog",
                    JSON.stringify(
                        savedActivities
                    )
                );


                activityInput.value = "";



                saveMessage.textContent =
                    "Saved!";


                setTimeout(
                    function () {

                        saveMessage.textContent =
                            "";

                    },
                    2000
                );

            }
        );

    }


})();







const activityList =
    document.getElementById("page4ActivityList");

const emptyMessage =
    document.getElementById("page4EmptyMessage");



function loadActivities() {

    let savedActivities =
        JSON.parse(
            localStorage.getItem("activityLog")
        ) || [];


    activityList.innerHTML = "";


    if (savedActivities.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }


    emptyMessage.style.display = "none";


    savedActivities.forEach(
        function (activity, index) {


            const activityItem =
                document.createElement("div");

            activityItem.className =
                "page4-activity-item";



            const date =
                document.createElement("div");

            date.className =
                "page4-activity-date";

            date.textContent =
                activity.date;


            const activityText =
                document.createElement("div");

            activityText.className =
                "page4-activity-text";

            activityText.textContent =
                activity.text;


            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";

            deleteButton.className =
                "page4-delete-button";

            deleteButton.setAttribute(
                "aria-label",
                "Delete activity"
            );


            deleteButton.innerHTML = `

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >

                    <path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM8 9h8v10H8V9Zm7.5-5-1-1h-5l-1 1H5v2h14V4h-3.5Z"
                    />

                </svg>

            `;


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteActivity(index);

                }
            );


            activityItem.appendChild(date);

            activityItem.appendChild(activityText);

            activityItem.appendChild(deleteButton);

            activityList.appendChild(activityItem);

        }
    );

}


function deleteActivity(index) {

    let savedActivities =
        JSON.parse(
            localStorage.getItem("activityLog")
        ) || [];


    savedActivities.splice(index, 1);


    localStorage.setItem(
        "activityLog",
        JSON.stringify(savedActivities)
    );


    loadActivities();

}


loadActivities();