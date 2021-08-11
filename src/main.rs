#[macro_use] extern crate rocket;

use serde::{Serialize, Deserialize};
use serde_json::json;
use rocket::fs::FileServer;
use rocket_dyn_templates::Template;
use rocket::response::{self, Responder};
use rocket::http::Status;
use rocket::Request;
use rocket::serde::json::Json;

#[get("/")]
fn index() -> Template {
    Template::render("index", json!({}))
}

#[get("/<_name>")]
fn csv_file(_name: &str) -> Template {
    Template::render("index", json!({}))
}

#[get("/api/table/<name>")]
fn get_table(name: &str) -> Result<Json<Table>> {
    panic!()
}

#[derive(Serialize, Deserialize)]
struct Table {
    headers: Vec<String>,
    rows: Vec<Row>,
}

#[derive(Serialize, Deserialize)]
struct Row {
    data: Vec<String>,
}

type Result<T> = std::result::Result<T, Error>;

#[derive(thiserror::Error, Debug)]
pub enum Error {
}

impl<'r> Responder<'r, 'static> for Error {
    fn respond_to(self, _: &'r Request<'_>) -> response::Result<'static> {
        Err(Status::InternalServerError)
    }
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![
            index,
            csv_file,
            get_table,
        ])
        .mount("/static", FileServer::from("static"))
        .attach(Template::fairing())
}
