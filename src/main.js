const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

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
    countdownEl.textContent = event.payload;
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
