# Fullstack-Webscraping-App

## Description

This project was created to track the gas prices in a selected city and dynamically display the average price by Gas Type over time. 

Using the webscraping library "Puppeteer" this app will input "Encinitas" into the site "https://www.geico.com/save/local-gas-prices/" and return results from the cheapest gas stations in a 5 mile radius. The data is written into a temp file and then  inserted into a PostgreSQL database based on Date, Gas Price, Gas Type, and Gas Station Address.

The Gas Data is fetched through use of a RESTful API created using Node/Express. By using the library Chartjs, the gas data is dynamically inserted into the line chart. The gas price ($$) is displayed over time by gas type (Regular, Mid-Grade, Premium, Diesel). 

The individual raw data is observed by selecting the "View data" modal button. The data can be filtered by gas type or gas station name/address. 

## Installation

Several modules were excluded due to size, specifically the "Puppeteer" library, which will need to be installed to run the webscraper.

## Future Plans

I will continue working on this project with ambitions to set up the webscraper to perform an automated daily scrape. Additionally, I plan to allow for the graph and data to be filtered by gas station to observe gas trends by individual station. 
