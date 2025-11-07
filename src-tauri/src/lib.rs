use tauri::{AppHandle, Emitter, Manager};
use tokio::time::{self, Duration};
use std::sync::Mutex;


struct CountdownState {
    is_running: Mutex<bool>,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn submit(timer: &str) -> String {
    format!("You have set the timer as: {}", timer)
}

#[tauri::command]
async fn start_timer(app_handle: AppHandle, duration_secs: u64) {
    let state = app_handle.state::<CountdownState>();

    {
        // Pedimos la llave (lock) para ver el valor
        let mut is_running = state.is_running.lock().unwrap();

        if *is_running {
            println!("A timer is already running. Ignoring new request.");
            return;
        }

        *is_running = true;
    }

    println!("Timer started for {} seconds", duration_secs);

    tokio::spawn(async move {
        run_countdown(app_handle, duration_secs).await;
    });
}

async fn run_countdown(app_handle: AppHandle, duration_secs: u64) {
    let mut remaining = duration_secs + 1; // +1 to include the 0 second

    let mut interval = time::interval(Duration::from_secs(1));
    while remaining > 0 {
        // Emit event to frontend with remaining time
        app_handle.emit("timer-tick", remaining).unwrap();
        println!("Emitting tick: {}", remaining);

        if remaining == 0 {
            break;
        }

        interval.tick().await;

        remaining -= 1;

    }
    println!("Timer completed!");
    app_handle.emit("timer-done", "times up").unwrap();

    // Reset the is_running state
    {
        let state = app_handle.state::<CountdownState>();
        let mut is_running = state.is_running.lock().unwrap();
        *is_running = false;
    }
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(CountdownState {is_running: Mutex::new(false)}) // Initializr in "false"
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![submit, start_timer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
