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
    use std::fs::File;

    let file = File::open(name).unwrap();
    let mut rdr = csv::Reader::from_reader(file);
    let mut rows = vec![];

    for record in rdr.records() {
        let record = record.unwrap();
        let values: Vec<_> = record.into_iter().map(ToString::to_string).collect();
        rows.push(values);
    }

    todo!()
}

#[derive(Serialize, Deserialize)]
struct Table {
    headers: Vec<Column>,
    rows: Vec<Vec<String>>,
}

#[derive(Serialize, Deserialize)]
struct Column {
    title: String,
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
