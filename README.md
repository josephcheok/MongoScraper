# MongoScraper

## Difficulties

Getting all the articles scraped before rendering the page. Dealt with promise.all

## Future Updates

Get axios to go to the stored urls and execute another cheerio to comb through the article to obtain the briefs.
Deleting the article would also delete the associated notes. Yet to figure out a simple way to establish a relationship between the two collections so that when the article gets deleted, all associated notes would be deleted as well.

## Improvements over Suggested Homework

- Scrapes multiple websites.
- Clears unsaved articles only.
