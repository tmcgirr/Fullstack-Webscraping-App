// npm install puppeteer-extra-plugin-stealth puppeteer-extra-plugin-adblocker
// npm install --save node-cron

const fs = require("fs/promises");
const puppeteer = require("puppeteer-extra");
const cron = require("node-cron");

process.setMaxListeners(0);

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// Add adblocker plugin to block all ads and trackers (saves bandwidth)
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

// Start puppeteer
const startPuppeteer = (location, childIndex, gasType) => {
  puppeteer.launch({ headless: true }).then(async (browser) => {
    const page = await browser.newPage();

    console.log(`Start Testing Scrape`);

    // Configure the navigation timeout
    await page.setDefaultNavigationTimeout(0);
    // Select page URL to visit
    await page.goto("https://www.geico.com/save/local-gas-prices/");
    // Wait for page to load
    await page.waitForTimeout(5000);
    // Enter "Input" (Encinitas hard code)
    await page.type("#address", `${location}`);
    // Submit address - search
    await page.click("#address_submit");
    // Wait for page to load
    await page.waitForTimeout(5000);

    // Gas Info page evaluate/action
    const gasInfo = await page.evaluate(
      (childIndex, gasType) => {
        // Init Object / Date
        let gasObject = new Object();
        let current = new Date();
        let cDate =
          current.getFullYear() +
          "-" +
          (current.getMonth() + 1) +
          "-" +
          current.getDate();

        // Date Gas is retrieved
        gasObject.date = cDate;

        // Name of Gas Station
        // gasObject.station_name = Array.from(
        //   document.querySelectorAll(
        //     `div:nth-child(${childIndex}) > div.card-heading > p > strong`
        //   )
        // )[0].innerText;

        // Gas Station Address
        // gasObject.address = Array.from(
        //   document.querySelectorAll(
        //     `div:nth-child(${childIndex}) > div.locationitem > p.address`
        //   )
        // )[0].innerText;

        gasObject.name_address =
          Array.from(
            document.querySelectorAll(
              `div:nth-child(${childIndex}) > div.card-heading > p > strong`
            )
          )[0].innerText +
          " - " +
          Array.from(
            document.querySelectorAll(
              `div:nth-child(${childIndex}) > div.locationitem > p.address`
            )
          )[0].innerText;

        // Gas Price - Varied on gas type
        gasObject.gas_price = Array.from(
          document.querySelectorAll(
            `div:nth-child(${childIndex}) > div.locationitem > div > div:nth-child(${gasType}) > div.gasPrice`
          )
        )[0].innerText.slice(1);

        // Gas Name - Varied on gas type
        gasObject.gas_type = Array.from(
          document.querySelectorAll(
            `div:nth-child(${childIndex}) > div.locationitem > div > div:nth-child(${gasType}) > div.gasName`
          )
        )[0].innerText;

        // Last updated - varied on gas type
        // gasObject.last_checked = Array.from(
        //   document.querySelectorAll(
        //     `div:nth-child(${childIndex}) > div.locationitem > div > div:nth-child(${gasType}) > div.gasDate`
        //   )
        // )[0].innerText;

        //  Return the Gas object
        return gasObject;
      },
      `${childIndex}`,
      `${gasType}`
    );

    //Write gas file to text in same directory
    await fs.writeFile(
      `./tempData/tempGasInfo${location}${childIndex}${gasType}.json`,
      JSON.stringify(gasInfo)
    );

    console.log(gasInfo);
    console.log(`Finished Scrape. ✨`);

    // Close browser after use - clean up
    await browser.close();
  });
};

// Get all data for cheapest 5 gas station and each type of gas (4 types)
const getGasFunction = async (location) => {
  try {
    for (let childIndex = 1; childIndex < 7; childIndex++) {
      for (let gasType = 1; gasType < 5; gasType++) {
        await startPuppeteer(location, childIndex, gasType);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

getGasFunction("Encinitas");

// const task = cron.schedule(
//   "* * * * *",
//   () => {
//     getAllGasInfo("Encinitas");
//   },
//   {
//     scheduled: true,
//   }
// );

// task.start();
