
const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

import { setUpListenerTimer } from "./js/timerListener.js"


/**
 * This converts total seconds into a format String MM::SS
 */
function formatTime(totalSeconds) {

  // This calculates and formats the hours
  const hours = Math.floor((totalSeconds/60) / 60);
  const formattedHours = String(hours).padStart(2, '0');

  // This calculates and formats the remaining seconds
  const seconds = totalSeconds % 60;
  const formattedSeconds = String(seconds).padStart(2, '0');

  let minutes = 0;
  let formattedMinutes = "";

  // This depends on how it's displayed the timer, wether you have hours or minutes. Just an UI thing
  if (hours != 0) {
    minutes = Math.floor(totalSeconds/60) % 60;
    formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    minutes = Math.floor(totalSeconds/60);
    formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

}

async function setupListeners(countdownEl, timerMsgEl) {
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

async function startTimer(timerInputEl, timerMsgEl) {
  // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  const duration = parseInt(timerInputEl.value, 10);
  
  if (isNaN(duration) || duration <= 0) {
    timerMsgEl.textContent = "Please enter a valid positive number.";
    return;
  }

  setUpListenerTimer(duration);

  invoke("start_timer", {durationSecs: duration});
}

export function initializeTimer(formEl, inputEl, msgEl, countdownEl) {
  
  // Setting up the listeners in order to make js listen to the Rust code
  setupListeners(countdownEl, msgEl);

  // Adds the listener to the form
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    startTimer(inputEl, msgEl); // Sends the elements requiered for start the timer correctly
  });
}
