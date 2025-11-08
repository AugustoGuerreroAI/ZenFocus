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
async fn start_timer(app_handle: AppHandle, duration_secs: i32) {
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

async fn run_countdown(app_handle: AppHandle, duration_secs: i32) {
    // Declaring the remaining in a local var and the interval between the changes of numbers
    let mut remaining = duration_secs;
    let mut interval = time::interval(Duration::from_secs(1));

    // First we check that the duration is compatible
    if valid_duration(&remaining) {
        while valid_duration(&remaining) {
            interval.tick().await;
            app_handle.emit("timer-tick", remaining).unwrap();
            println!("number emitted: {}", remaining);

            remaining -= 1;
        } 

        interval.tick().await;
        println!("Timer finished");
        app_handle.emit("timer-done", "times up").unwrap();

        // Here we reset the is_running state
        {
            let state = app_handle.state::<CountdownState>();
            let mut is_running = state.is_running.lock().unwrap();
            *is_running = false;
        }
    } else {
        println!("Invalid duration: {}. Timer must be non-negative.", remaining);
        app_handle.emit("timer-tick", "Invalid Duration").unwrap();
    }
}

fn valid_duration(r: &i32) -> bool {
    *r >= 0
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
