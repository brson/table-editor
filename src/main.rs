#[macro_use] extern crate rocket;

use serde_json::json;
use rocket::fs::FileServer;
use rocket_dyn_templates::Template;
use rocket::response::{self, Responder};
use rocket::http::Status;
use rocket::Request;

#[get("/")]
fn index() -> Template {
    Template::render("index", json!({}))
}

#[get("/<name>")]
fn csv_file(name: &str) -> Result<()> {
    todo!()
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
            csv_file
        ])
        .mount("/static", FileServer::from("static"))
        .attach(Template::fairing())
}
