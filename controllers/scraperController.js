var express = require("express");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Initialize Express
var router = express.Router();

// A GET route for scraping the cNet website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  let p1 = axios
    .get("https://www.cnet.com/facial-recognition/")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // Save an empty result object

      var data = [];

      // Now, we grab every div with the following class name, and do the following:
      $('div[class="col-8 item "]').each(function(i, element) {
        // Add the text and href of every link, and save them as properties of the result object
        var result = {};
        result.title = $(this)
          .children("span")
          .children("a")
          .children("div")
          .children("h3")
          .text();
        result.brief = $(this)
          .children("span")
          .children("a")
          .children("div")
          .children("p")
          .text();
        result.link =
          "https://cnet.com" +
          $(this)
            .children("span")
            .children("a")
            .attr("href");

        data.push(result);
      });

      var promises = data.map(result => {
        //Create new record outside of the exists function (db.Article.create(result) duplicates exsiting record)
        let article = new db.Article(result);
        // Check if record already exists based on title, if not, create new record
        return db.Article.exists({ title: result.title }).then(function(
          exists
        ) {
          if (!exists) {
            return db.Article.create(article)
              .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
              });
          }
        });
      });

      //This is created to grab the large articles, but turned out to be redundant or ad. Switched off for now.
      //   $('div[class="col-8 item large"]').each(function(i, element) {
      //     result.title = $(this)
      //       .children("div")
      //       .children("h3")
      //       .text();
      //     result.link =
      //       "https://cnet.com" +
      //       $(this)
      //         .children("a")
      //         .attr("href");

      //     let article = new db.Article(result);
      //     db.Article.exists({ title: result.title }).then(function(exists) {
      //       if (!exists) {
      //         db.Article.create(article)
      //           .then(function(dbArticle) {
      //             // View the added result in the console
      //             console.log(dbArticle);
      //           })
      //           .catch(function(err) {
      //             // If an error occurred, log it
      //             console.log(err);
      //           });
      //       }
      //     });
      //   });
      // Send a message to the client
      return Promise.all(promises);
    });

  let p2 = axios
    .get("https://www.theguardian.com/technology/facial-recognition")
    .then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // Save an empty result object

      var data = [];

      // Now, we grab every div with the following class name, and do the following:
      $('div[class="fc-item__content "]').each(function(i, element) {
        var result = {};
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("div")
          .children("h3")
          .children("a")
          .children("span")
          .children("span")
          .text();
        result.brief = $(this)
          .children(
            'div[class="fc-item__standfirst-wrapper fc-item__standfirst-wrapper--timestamp"]'
          )
          .children("div")
          .text();
        result.link = $(this)
          .children("div")
          .children("h3")
          .children("a")
          .attr("href");

        data.push(result);
      });

      var promises = data.map(result => {
        let article = new db.Article(result);
        // Check if record already exists based on title, if not, create new record
        return db.Article.exists({ title: result.title }).then(function(
          exists
        ) {
          if (!exists) {
            return db.Article.create(article)
              .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
              });
          }
        });
        // do database things here and return the resulting promise
      });

      return Promise.all(promises);
    });
  Promise.all([p1, p2]).then(() => {
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
router.get("/", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({ saved: false })
    .then(function(dbArticle) {
      var hbsObject = { article: dbArticle };
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db
router.get("/saved", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({ saved: true })
    .then(function(dbArticle) {
      var hbsObject = { article: dbArticle };
      // If we were able to successfully find Articles, send them back to the client
      res.render("index", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/save", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Article.findOne({ _id: req.body.id })
    .then(function(dbArticle) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: dbArticle._id },
        { saved: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
router.post("/notes/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
      console.log("After note created: " + dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.delete("/:id", function(req, res) {
  db.Article.remove({ _id: req.params.id })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.delete("/note/:id", function(req, res) {
  db.Note.remove({ _id: req.params.id })
    .then(function(dbNote) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

router.post("/clear", function(req, res) {
  db.Article.remove({ saved: false })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
      console.log(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});
// Export routes for server.js to use.
module.exports = router;
