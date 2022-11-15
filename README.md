### Easy Webscraping Server

Easy to use server for webscraping in Javascript. All that is required is a url and an html string sent in the request body. The server then runs a headless chromium instance to scrape the url provided for the html string provided.

Example request for scraping cfb games from [ESPN](https://www.espn.com/college-football/schedule/_/week/1/year/2022/seasontype/2):
```javascript
const url = 'https://www.espn.com/college-football/schedule/_/week/1/year/2022/seasontype/2';
const htmlString = '.Table tbody tr .teams__col a';

fetch(`http://vercel-webscraping-server.vercel.app/scrape?value=${url}&value=${htmlString}`)
            .then(res => res.json())
            .then(body => {
                return body.data;
            });
```