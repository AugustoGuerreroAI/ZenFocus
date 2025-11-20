

export function initializeSwitchListeners() {
    // Finds the elements fro view switching (NEW LOGIC IMPLEMENTED LES GOOO)
    const mainView = document.getElementById("main-view");
    const settingsView = document.getElementById("settings-view");
    const settingsButton = document.getElementById("settings-button");
    const backButton = document.getElementById("back-button");

    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            switchView('settings', mainView, settingsView, settingsButton);
        });
    }

    if (backButton) {
        backButton.addEventListener('click', () => {
            switchView('main', mainView, settingsView, settingsButton);
        });
    }
}


function switchView(viewToShow, mainView, settingsView, settingsButton) {
    if (viewToShow === 'settings') {
        // Oculta la vista principal y muestra la configuración
        mainView.style.display = 'none'; // We hide it
        settingsView.style.display = 'block'; // This means that it's gonna fill everything
    } else { // 'main'
        // Muestra la vista principal y oculta la configuración
        settingsView.style.display = 'none';
        mainView.style.display = 'block'; 
    }
}