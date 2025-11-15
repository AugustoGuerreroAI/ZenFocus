let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");

let progressStartValue = 0,
    progressEndValue = 1,
    speed = 500; // If I want 1 sec = 1000

let progress = setInterval(() => {
    progressStartValue++; 

    progressValue.textContent = `${progressStartValue}%`

    // Old method, wasn't as smooth as the next one below
    // circularProgress.style.background = `conic-gradient(#c9c8c8 ${progressStartValue * 3.6}deg, #575353 0deg)`


    // Here we only updates a variable in CSS, then CSS does the rest for us
    let newAngle = progressStartValue * 3.6;
    circularProgress.style.setProperty('--progress-angle', `${newAngle}deg`);


    if (progressStartValue == progressEndValue) {
        clearInterval(progress);
    }

    console.log(progressStartValue);
}, speed);

