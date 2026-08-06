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