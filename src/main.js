// 1. Imports the module I already created
import { initializeTimer } from './timer.js';

// 2. Waits until DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  
  // 3. Finds the elements
  const timerForm = document.querySelector("#start-timer");
  const timerInputEl = document.querySelector("#timer-input");
  const timerMsgEl = document.querySelector("#timer-msg");
  const countdownEl = document.querySelector("#countdown");

  // 4. Calls the initializer and sends everything, so the logic goes to timer.js 
  initializeTimer(timerForm, timerInputEl, timerMsgEl, countdownEl);
});