
let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");

let progressInterval = null;
let elapsedSeconds = 0;
let totalDuration = 0;
const speed = 1000; //1 sec;





export function setUpListenerTimer(durationSecs) {
    // If it exist right now a timer, clear it before starting a new one
    if (progressInterval) {
        clearInterval(progressInterval);
    }

    totalDuration = durationSecs;
    elapsedSeconds = 0; // It resets the counter of secs;

    progressValue.textContent = "0%";

    circularProgress.style.setProperty('--progress-angle', `0deg`);

    progressInterval = setInterval(() => {
        elapsedSeconds++;
        let percentage = (elapsedSeconds / totalDuration) * 100;

        let newAngle = (elapsedSeconds / totalDuration) * 360;

        progressValue.textContent = `${Math.floor(percentage)}%`;

        circularProgress.style.setProperty('--progress-angle', `${newAngle}deg`);

        if (elapsedSeconds >= totalDuration) {
            clearInterval(progressInterval);
            progressInterval = null;
        }

    }, speed);
    console.log("Timer started for: ", durationSecs, "seconds");

} 