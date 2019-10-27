$(document).on("click", ".scrape-new", function(event) {
  // Send the PUT request.
  $.ajax("/scrape", {
    method: "GET"
  }).then(function() {
    console.log("Articles Scraped!");
    // Reload the page to get the updated list
    location.reload();
  });
});

//On click of Save button of article, post status change to server.
$(document).on("click", ".save", function(event) {
  var id = $(this).data("id");
  // Send the PUT request.
  $.ajax("/save", {
    method: "POST",
    data: { id: id }
  }).then(function() {
    console.log("Article Saved!");
    // Reload the page to get the updated list
    location.reload();
  });
});

//On click of Delete button, delete Article from server
$(document).on("click", ".delete", function(event) {
  var id = $(this).data("id");
  // Send the PUT request.
  $.ajax("/" + id, {
    method: "DELETE"
  }).then(function() {
    console.log("Article " + id + "Deleted!");
    // Reload the page to get the updated list
    location.reload();
  });
});

// Whenever someone clicks a p tag
$(document).on("click", "notes", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
      );

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(body).on("click", ".close", function(event) {
  $(".modal").hideAll();
});
