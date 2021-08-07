#[macro_use] extern crate rocket;

use serde_json::json;
use rocket::fs::FileServer;
use rocket_dyn_templates::Template;

#[get("/")]
fn index() -> Template {
    Template::render("index", json!({}))
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![index])
        .mount("/static", FileServer::from("static"))
        .attach(Template::fairing())
}
