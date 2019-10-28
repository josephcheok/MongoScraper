var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});

// Routes
// Import routes and give the server access to them.
var routes = require("./controllers/scraperController");

app.use(routes);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
