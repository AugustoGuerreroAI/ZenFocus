// 1. Imports the module I already created
import { initializeTimer } from '/js/timer.js';
import { initializeSwitchListeners } from '/js/switchListen.js'

// 2. Waits until DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  
  // 3. Finds the elements
  const timerForm = document.querySelector("#start-timer");
  const timerInputEl = document.querySelector("#timer-input");
  const timerMsgEl = document.querySelector("#timer-msg");
  const countdownEl = document.querySelector("#countdown");


  // 4. We initialize Switch Listeners!!!
  initializeSwitchListeners();

  // 7. Calls the initializer and sends everything, so the logic goes to timer.js 
  initializeTimer(timerForm, timerInputEl, timerMsgEl, countdownEl);
});


