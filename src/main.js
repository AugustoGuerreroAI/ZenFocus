const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

/**
 * This converts total seconds into a format String MM::SS
 */
function formatTime(totalSeconds) {
  // this calculates the hours
  const hours = Math.floor((totalSeconds/60) / 60);

  // this calculates the minutes
  const minutes = Math.floor(totalSeconds/60) % 60;

  // this calculates the rest of the seconds
  const seconds = totalSeconds % 60;

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // returns the string combined
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

let timerInputEl;
let timerMsgEl;
let countdownEl; // Element for counter display

async function startTimer() {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  const duration = parseInt(timerInputEl.value, 10);
  
  if (isNaN(duration) || duration <= 0) {
    timerMsgEl.textContent = "Please enter a valid positive number.";
    return;
  }

  invoke("start_timer", {durationSecs: duration});
}


async function setupListeners() {
  const unListenTick = await listen("timer-tick", (event) => {
    console.log("Tick:", event.payload);

    countdownEl.textContent = formatTime(event.payload);
  });

  const unListenDone = await listen("timer-done", (event) => {
    console.log("Timer done:", event.payload);
    timerMsgEl.textContent =  event.payload;
    countdownEl.textContent = "Timer completed!";
  });
}

window.addEventListener("DOMContentLoaded", () => {
  timerInputEl = document.querySelector("#timer-input");
  timerMsgEl = document.querySelector("#timer-msg");
  countdownEl = document.querySelector("#countdown");

  document.querySelector("#start-timer").addEventListener("submit", (e) => {
    e.preventDefault();
    startTimer();
  });

  setupListeners();
});
