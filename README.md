# MongoScraper

### To view the deployed version, _**[click here!](https://mongo-scraper-principio.herokuapp.com/)**_

## Overview

This is an app that uses Cheerio to scrape the Cnet and Guardian's section on facial recognition technology news and pull the most recent articles, giving the user the following:

1. Title of article
2. Brief of article (where available, otherwise date of publishing would just appear)
3. Clicking the title would enable the user to go to the source website to read the article.

Other actions that can be performed on this site:

1. Saving the article
2. Make notes on the article (multiple)
3. Save the notes
4. Delete
   1. Saved article
   2. Saved notes
5. Clear all unsaved articles

## Technologies used:

- Node.js
- Express.js
- MongoDB
- Mongoose
- Handlebars.js
- Javascript/ES6
- jQuery
- AJAX/JSON
- NPM modules:
  - Cheerio
  - Request-Promise
- Bootstrap 4
- CSS3
- HTML5

## Difficulties

Getting all the articles scraped before rendering the page. Dealt with promise.all which only renders the page when all promises have been resolved. Please wait at least 5 seconds for page to fully load up with articles.

## Future Updates

- Get axios to go to the stored urls and execute another cheerio to comb through the article in the stored url to obtain the briefs.
- Deleting the article would also delete the associated notes. Yet to figure out a simple way to establish a relationship between the two collections so that when the article gets deleted, all associated notes would be deleted as well. This is the pitfall of using a non-relational database like Mongo DB.

## Upgrades over Original Model

- Scrapes multiple websites.
- Clears unsaved articles only.
