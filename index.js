const puppeteer = require("puppeteer");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());

class Scraper {
    constructor(url, htmlString) {
        this.url = url;
        this.htmlString = htmlString;
    }

    async startBrowser() {
        try {
            console.log("Opening the browser...");
            let browser = await puppeteer.launch({
                args: ["--no-sandbox"]
            });
            return browser;
        } catch (err) {
            console.log("Could not create a browser instance => : ", err);
        }
    }

    async findPage(browser) {
        try {
            let page = await browser.newPage();
            return page;
        } catch (err) {
            console.log("Oops", err);
        }
    }

    async scrapePage(page) {
        try {
            console.log(`Navigating to ${this.url}...`);
            await page.goto(this.url, { waitUntil: 'load', timeout: 0 });
            let team = await page.$$eval(this.htmlString, res => {
                res = res.map(el => el.innerText)
                return res;
            })
            return team;
        }
        catch (err) {
            console.log("Could not resolve the browser instance => ", err);
        } finally {
            await page.close();
        }
    }
}

app.get("/", (req, res) => {
    res.json({ status: "Server is running!" });
});

app.get("/scrape", async (req, res) => {
    let url = req.query.value[0];
    let htmlString = req.query.value[1];
    let data = await runScrape(url, htmlString);
    res.json({ data })
})

const runScrape = async (url, htmlString) => {
    let scraper = new Scraper(url, htmlString)
    let browser = await scraper.startBrowser();
    let page = await scraper.findPage(browser);
    let data = await scraper.scrapePage(page);
    console.log(data);
    return data;
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app;