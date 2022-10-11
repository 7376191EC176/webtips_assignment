// import npm package
// create child process to speed-up fetching process

const staticCityData = require("timezone_kalai");

// to call functions according to the message content
process.on("message", (msg) => {
  // fetch data of all cities
  if (msg.messageContent === "/all-timezone-cities") {
    process.send(staticCityData.allTimeZones());
    process.exit();
  } 
  // fetch live time and date of selected city
  else if (msg.messageContent === "/city") {
    process.send(staticCityData.timeForOneCity(msg.messageBody));
    process.exit();
  } 
  // fetch the future temperature of selected city
  else if (msg.messageContent === "/hourly-forecast") {
    process.send(
      staticCityData.nextNhoursWeather(msg.cityDTN, msg.hours, msg.allCityData)
    );
    process.exit();
  }
});
