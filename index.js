const express = require("express");
const winston = require("winston");

const app = express();
app.get("/", async (req, res) => {
  console.log("get request made : test request");
  return res.send("test api working");
});
require("./startup/logging")(); //logging errors
require("./startup/routes")(app); //load the routes
require("./startup/db")(); //connect to database
require("./startup/config")(); //check for config values or env values. if not found throw error
require("./startup/validation")(); //Joi related statements req for api endpoint events validation

const port = process.env.PORT || 3000;
if(!(process.env.NODE_ENV && process.env.NODE_ENV==='production')){
  const server = app.listen(port, () =>
  winston.info(`Listening on port ${port}...`)
);
}

module.exports.app = app;

