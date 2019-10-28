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

//On click of Delete button, delete Note from server
$(document).on("click", ".note-delete", function(event) {
  var id = $(this).data("id");
  // Send the PUT request.
  $.ajax("/note/" + id, {
    method: "DELETE"
  }).then(function() {
    console.log("Article " + id + "Deleted!");
    // Reload the page to get the updated list
    location.reload();
  });
});

// Whenever someone clicks a p tag
$(document).on("click", ".notes", function() {
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      $('div[class="bootbox modal"]').show();
      $('button[class="btn btn-success savenote"]').attr("data-id", data._id);
      $("h4").text(`Notes for Article : ${data.title}`);
      if (data.note.length) {
        $(".list-group-item").hide();
      }
      data.note.forEach(item => {
        $('ul[class="list-group note-container"]').append(
          `<li class="note-list">${item.body}<button class="btn btn-danger note-delete" data-id=${item._id}>&times</button></li>`
        );
      });
    });
});

// When you click the savenote button
$(document).on("click", ".savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("textarea").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      $(".note-list").remove();
      $(".list-group-item").show();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#noteinput").val("");
  $('div[class="bootbox modal"]').hide();
});

$(document).on("click", ".close", function(event) {
  $('div[class="bootbox modal"]').hide();
  $(".note-list").remove();
  $(".list-group-item").show();
});

$(document).on("click", ".clear", function(event) {
  $.ajax("/clear", {
    method: "POST"
  }).then(function() {
    console.log("Unsaved Articles Deleted!");
    // Reload the page to get the updated list
    location.reload();
  });
});
