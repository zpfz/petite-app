#![windows_subsystem="windows"]

use docopt::Docopt;

use std::env;
use std::path::Path;
use std::process;

extern crate sciter;

const USAGE: &'static str = "
Petite App.

Usage:
  petite-app.exe app-name <app-name>
  petite-app.exe load-path <load-path>
  petite-app.exe (-h | --help)
  petite-app.exe (-v | --version)

Options:
  -h, --help                Show Petite App help.
  -v, --version             Show Petite App version.
  app-name <app-name>       Load application from default path.
  load-path <load-path>     Load application from target path.
";

fn main() {
    let args = Docopt::new(USAGE)
        .and_then(|dopt| dopt.parse())
        .unwrap_or_else(|e| e.exit());

	// ========================================================================================
	// Show the petite-app version
	// e.g.  =====>  petite-app.exe -v
	// ========================================================================================
    if args.get_bool("--version") {
        println!("Petite App v{}", env!("CARGO_PKG_VERSION"));
        process::exit(0x0100);
    }

	// ========================================================================================
	// Load app from apps path
	// e.g.  =====>  petite-app.exe app-name petite-app-1
	// ========================================================================================
    if args.get_bool("<app-name>") {
        let current_dir = env::current_dir().unwrap().display().to_string();
        let apps_path = current_dir.as_str();
        let apps_dir = "apps";
        let apps_name = args.get_str("<app-name>");
        let apps_file = "app.html";
        let result = [apps_path, apps_dir, apps_name, apps_file].join("\\");

        match Path::new(&result).exists() {
            true => {
				load_app(&result);
			},
            false => process::exit(0x0100),
        };
    };

	// ========================================================================================
	// Load app from specific path
	// e.g.  =====>  petite-app.exe load-path "D:\my-petite-apps\petite-app-1"
	// ========================================================================================
    if args.get_bool("<load-path>") {
        let apps_path = args.get_str("<load-path>");
        let apps_file = "app.html";
        let result = [apps_path, apps_file].join("\\");

        match Path::new(&result).exists() {
			true => {
				load_app(&result);
			},
            false => process::exit(0x0100),
        };
    }
}


pub fn load_app(path: &str){
	let mut frame = sciter::Window::new();
	frame.load_file(path);
	frame.run_app();
}