// to load index file at the initial stage
// to create a server to access the weather data
// to fetch the data(temperature, humidity, precipitation, timezone) of all the cities
// to fecth the future temperature of the selected city by using the data fetched by another function to fetch selected city live date and time.

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { fork } = require("child_process");
const fs = require("fs");

let initialTime = new Date();
let dayCheck = 1.44e7;
let allCityData = [];
let currentTime;

// to use all type of files with different type of extension
app.use(express.static(__dirname));

// direct to index.html at the initial stage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//parse application to display the contents
// extended: false is used which to parse the data between the querystring library which is sufficient for this application
app.use(bodyParser.urlencoded({ extended: false }));

//convert to json
app.use(bodyParser.json());

// to fetch and respond the data of all the given cities
app.get("/all-timezone-cities", (req, res) => {
  initialTime = new Date();
  // fetch the data of all cities
  if (currentTime - initialTime > dayCheck) {
    const forked = fork("./JS/child.js");
    forked.send({
      messageContent: "/all-timezone-cities",
      messageBody: "",
    });
    forked.on("message", (msg) => {
      allCityData = msg;
      res.json(allCityData);
    });
  }
  // fetch the data of all cities if the city list length is 0
  else {
    if (allCityData.length === 0) {
      const forked = fork("./JS/child.js");
      forked.send({
        messageContent: "/all-timezone-cities",
        messageBody: "",
      });
      forked.on("message", (msg) => {
        allCityData = msg;
        res.json(allCityData);
      });
    }
    // if there is any data in allCityData object
    else {
      res.json(allCityData);
    }
  }
});

// to fetch and respond the data(live time and date) of particular city
app.get("/city", (req, res) => {
  try {
    //if the request body is empty throw an error
    if (!req.body) {
      let errorOccuredTime = new Date();
      throw new Error(
        `${errorOccuredTime} : request body is not passed in fetching selected city data`
      );
    }
    // if the request body is not empty the following will be executed
    else {
      // if the city is not selected throw an error
      if (!req.query.city) {
        let errorOccuredTime = new Date();
        throw new Error(
          `${errorOccuredTime} : city is not selected to fetch city data of selected city`
        );
      }
      // if there is no error fetch the data of the selected city
      else {
        const forked = fork("./JS/child.js");
        forked.send({
          messageContent: "/city",
          messageBody: req.query.city,
        });
        forked.on("message", (msg) => {
          let timeAndDateOfTheSelectedCity = msg;
          res.json(timeAndDateOfTheSelectedCity);
        });
      }
    }
  } catch (error) {
    // catch the error and save it in logger.txt file
    fs.appendFile("logger.txt", `\n${error.message}`, (err) => {
      console.log("Error occurs: Invalid city url");
      res.json("error");
    });
  }
});

// to fetch and respond the future temperature of the given city
app.post("/hourly-forecast", (req, res) => {
  let cityDTN = req.body.city_Date_Time_Name;
  let hours = req.body.hours;
  try {
    //if the request body is empty throw an error
    if (!req.body) {
      let errorOccuredTime = new Date();
      throw new Error(
        `${errorOccuredTime} : request body is not passed in fetching future temperature of selected city`
      );
    }
    // if the request body is not empty the following will be executed
    else {
      // if the city data of selected city is not fetched
      if (!cityDTN) {
        let errorOccuredTime = new Date();
        throw new Error(
          `${errorOccuredTime} : city data is not passed to fetch future temperature of selected city`
        );
      }
      // if number of following hours which temperature is needed is not defined
      else if (!hours) {
        let errorOccuredTime = new Date();
        throw new Error(
          `${errorOccuredTime} : number of hours is not passed to fetch future temperature of selected city`
        );
      }
      // if there is no error fetch the data of the selected city
      else {
        const forked = fork("./JS/child.js");
        forked.send({
          messageContent: "/hourly-forecast",
          cityDTN: cityDTN,
          hours: hours,
          allCityData: allCityData,
        });
        forked.on("message", (msg) => {
          res.json(msg);
        });
      }
    }
  } catch (error) {
    fs.appendFile("logger.txt", `\n${error.message}`, (err) => {
      const forked = fork("./JS/child.js");
      forked.send({
        messageContent: "/hourly-forecast",
        cityDTN: "10/10/2022, 2:14:50 PM, Vienna",
        hours: 5,
        allCityData: allCityData,
      });
      forked.on("message", (msg) => {
        res.json(msg);
      });
      console.log("Error occurs: Invalid future temperature fetch url");
    });
  }
});

app.listen(8080);
