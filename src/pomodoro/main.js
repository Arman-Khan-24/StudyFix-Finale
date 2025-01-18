// Timer functionality
let isRunning = false;
let timeLeft = 1498; // 24:58 in seconds
let timerInterval;
let totalFocusTime = 0;
let isWhiteNoiseOn = false;
let whiteNoiseAudio = null;

const timerDisplay = document.getElementById("timer");
const fullscreenTimerDisplay = document.getElementById("fullscreen-timer");
const continueBtn = document.getElementById("continue-btn");
const stopBtn = document.getElementById("stop-btn");
const progressCircle = document.getElementById("progress-circle");
const focusTimeDisplay = document.getElementById("focus-time");
const focusProgress = document.getElementById("focus-progress");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const tasksList = document.getElementById("tasks-list");
const todayTasks = document.getElementById("today-tasks");
const addTaskBtn = document.getElementById("add-task-btn");
const fullscreenModal = document.getElementById("fullscreen-modal");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const exitFullscreenBtn = document.getElementById("exit-fullscreen");
const fullscreenPlayBtn = document.getElementById("fullscreen-play");
const fullscreenResetBtn = document.getElementById("fullscreen-reset");
const whiteNoiseBtn = document.getElementById("white-noise-btn");

// White noise sounds array
const whiteNoiseSounds = [
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3", // Rain
  "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d1a1766a6e.mp3", // Ocean
  "https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39bde808.mp3", // Forest
];

// Calculate the circumference of the progress circle
const circumference = 2 * Math.PI * 150;
progressCircle.style.strokeDasharray = circumference;

// Task Management
function createTaskElement(taskText, container, withCheckbox = true) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "flex items-center gap-2 bg-gray-700/50 p-3 rounded-lg";

  if (withCheckbox) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className =
      "form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-500 bg-gray-700";
    taskDiv.appendChild(checkbox);
  }

  const text = document.createElement("span");
  text.textContent = taskText;
  text.className = "flex-1";
  taskDiv.appendChild(text);

  container.appendChild(taskDiv);
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText) {
    createTaskElement(taskText, tasksList);
    createTaskElement(taskText, todayTasks, false);
    taskInput.value = "";
  }
});

addTaskBtn.addEventListener("click", () => {
  const taskText = prompt("Enter task name:");
  if (taskText?.trim()) {
    createTaskElement(taskText, todayTasks, false);
  }
});

// Timer Functions
function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  timerDisplay.textContent = timeString;
  fullscreenTimerDisplay.textContent = timeString;

  // Update progress circle
  const progress = timeLeft / 1498;
  const offset = circumference - progress * circumference;
  progressCircle.style.strokeDashoffset = offset;
}

function updateFocusTime() {
  const minutes = Math.floor(totalFocusTime / 60);
  focusTimeDisplay.textContent = minutes;
  focusProgress.style.width = `${(minutes / 60) * 100}%`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    continueBtn.textContent = "Pause";
    fullscreenPlayBtn.textContent = "Pause";
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        totalFocusTime++;
        updateTimer();
        updateFocusTime();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        continueBtn.textContent = "Continue";
        fullscreenPlayBtn.textContent = "Play";
      }
    }, 1000);
  } else {
    stopTimer();
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  continueBtn.textContent = "Continue";
  fullscreenPlayBtn.textContent = "Play";
}

function resetTimer() {
  stopTimer();
  timeLeft = 1498;
  updateTimer();
}

// White Noise
function toggleWhiteNoise() {
  if (!isWhiteNoiseOn) {
    if (!whiteNoiseAudio) {
      const randomSound =
        whiteNoiseSounds[Math.floor(Math.random() * whiteNoiseSounds.length)];
      whiteNoiseAudio = new Audio(randomSound);
      whiteNoiseAudio.loop = true;
    }
    whiteNoiseAudio.play();
    isWhiteNoiseOn = true;
    whiteNoiseBtn.classList.add("text-indigo-500");
  } else {
    whiteNoiseAudio?.pause();
    isWhiteNoiseOn = false;
    whiteNoiseBtn.classList.remove("text-indigo-500");
  }
}

// Fullscreen Mode
function toggleFullscreen() {
  fullscreenModal.classList.toggle("hidden");
}

// Event Listeners
continueBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
fullscreenBtn.addEventListener("click", toggleFullscreen);
exitFullscreenBtn.addEventListener("click", toggleFullscreen);
fullscreenPlayBtn.addEventListener("click", startTimer);
fullscreenResetBtn.addEventListener("click", resetTimer);
whiteNoiseBtn.addEventListener("click", toggleWhiteNoise);

// Initial setup
updateTimer();
updateFocusTime();
