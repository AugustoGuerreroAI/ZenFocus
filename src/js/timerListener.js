
const { listen } = window.__TAURI__.event;

let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");

let unListenTimer = null;
let totalDuration = 0;


let progressInterval = null;
let elapsedSeconds = 0;



async function startTimerListener() {
    unListenTimer = await listen("timer-tick", (event) => {

        // Obtain the truth from Rust
        // payload = remaining 
        const remainingSeconds = event.payload;

        // We calculate in JS based of what rust says
        const elapsedSeconds = totalDuration - remainingSeconds;

        let percentage = (elapsedSeconds / totalDuration) * 100;
        let newAngle = (elapsedSeconds / totalDuration) * 360;

        // Update the UI
        progressValue.textContent = `${Math.floor(percentage)}%`;
        circularProgress.style.setProperty('--progress-angle', `${newAngle}deg`);

        // If Rust = 0 -> finish
        if (remainingSeconds <= 0) {
            if (unListenTimer) {
                unListenTimer();
                unListenTimer = null;
                console.log("Timer finished");
            }
        }
    });

}


export function setUpListenerTimer(durationSecs) {
    totalDuration = durationSecs;
    progressValue.textContent = "0%";
    circularProgress.style.setProperty('--progress-angle', `0deg`);

    startTimerListener();
    console.log("Timer started for: ", durationSecs, "seconds");
} 