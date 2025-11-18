use tauri::{AppHandle, Emitter, Manager};
use tokio::time::{self, Duration};

use tokio::task::JoinHandle; 
use std::sync::Mutex;


struct CountdownState {
    current_timer: Mutex<Option<JoinHandle<()>>>,
}

#[tauri::command]
fn submit(timer: &str) -> String {
    format!("You have set the timer as: {}", timer)
}

#[tauri::command]
async fn start_timer(app_handle: AppHandle, duration_secs: i32) {
    let state = app_handle.state::<CountdownState>();

    // We block the mutex in order to measure it as a safer way
    // It returns a MutexGuard that acts as a mutable temporary reference for the internal value of Mutex (That is Option<JoinHandle()>>)
    let mut current_timer_guard = state.current_timer.lock().unwrap();

    // take is a method from Option<T> that extracts the Internal Value T, if Option = Some(T), or It returns None instead of the original place from memory
    match current_timer_guard.take() {
        Some(handle) => {
            println!("Aborting previous timer");
            handle.abort();
        }
        None => {} // We do nothing
    }

    // We print duration
    println!("timer started for {} seconds", duration_secs);

    // Cloning the app handle as a way to fix ownership issues
    let app_handle_clone = app_handle.clone(); 

    // Spawn a task for running in the background
    let handle = tokio::spawn(async move {
        run_countdown(app_handle_clone, duration_secs).await;
    });


    // We put the current_timer_guard as the result of the new handle, so then we have a reference to the task
    *current_timer_guard = Some(handle);

}

async fn run_countdown(app_handle: AppHandle, duration_secs: i32) {
    // Declaring the remaining in a local var and the interval between the changes of numbers
    let mut remaining = duration_secs;
    let mut interval = time::interval(Duration::from_secs(1));

    // First we check that the duration is compatible
    if valid_duration(&remaining) {
        while valid_duration(&remaining) {
            interval.tick().await;


            // This checks that it gets an error, it will break
            if app_handle.emit("timer-tick", remaining).is_err() { break }
            println!("number emitted: {}", remaining);

            remaining -= 1;
        } 

        interval.tick().await;
        println!("Timer finished");
        app_handle.emit("timer-done", "times up").unwrap();

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
        .manage(CountdownState { current_timer: Mutex::new(None)}) 
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![submit, start_timer])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
