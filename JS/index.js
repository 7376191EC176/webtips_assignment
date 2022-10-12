import {
  updateUIElementAttributeWithGivenValue,
  appendZero,
} from "./utility.js";

import { getCityData, getCityWeather } from "./weatherdata.js";

//Top section

let cityNames = [];
let timeout;
let selectedCityData;
let climateData;
let data = {};
let selectedCity = "Vienna";

/**
 * To set the object data with-respect to the city selected
 * To return the data needed for the particular city
 * @param {string} selectedCity pass the key of selected city to access data
 */

class SetSelectedCityDetails {
  climateIcon = document.getElementsByClassName("weather-icon");
  hourWeather = document.getElementsByClassName("rep");
  weatherTime = document.getElementsByClassName("time");
  warningImagePath = `./assets/warning.svg`;
  currentTimeLabel = "NOW";
  nullValue = "Nil";
  constructor() {
    this.selectedCity = data[selectedCity.toLowerCase()].cityName;
    this.imagePath = `./assets/${selectedCity.toLowerCase()}.svg`;
    this.timeZoneOfSelectedCity = data[selectedCity.toLowerCase()].timeZone;
    this.currentTemperature = parseInt(
      data[selectedCity.toLowerCase()].temperature
    );
    this.precipitation = data[selectedCity.toLowerCase()].precipitation;
    this.humidity = data[selectedCity.toLowerCase()].humidity;
    // To return the city image of the selected city
    this.getIconPathOfSelectedCity = function () {
      return this.imagePath;
    };

    // To return the time-zone of the selected city
    this.getTimeZoneOfSelectedCity = function () {
      return this.timeZoneOfSelectedCity;
    };

    // To return the temperature of the selected city
    this.getTemperatureOfSelectedCity = function () {
      return this.currentTemperature;
    };

    // To return the precipitation value of the selected city
    this.getPrecipitationOfSelectedCity = function () {
      return this.precipitation;
    };

    // To return the humidity value of the selected city
    this.getHumidityOfSelectedCity = function () {
      return this.humidity;
    };
  }
  /**
   * To display the Live time of the selected city
   * Live time is fetched with the given timezone
   * @param {string} currentDate Live date and time
   * @return {void} nothing
   */
  displayCurrentTime(currentDate) {
    let time = {
      hr: selectedCityData.appendZero(currentDate.getHours()),
      min: selectedCityData.appendZero(currentDate.getMinutes()),
      sec: selectedCityData.appendZero(currentDate.getSeconds()),
      timeIcon:
        currentDate.getHours() >= 12
          ? `./assets/pmState.svg`
          : `./assets/amState.svg`,
    };
    time.hr =
      time.hr > 12
        ? selectedCityData.appendZero(time.hr - 12)
        : time.hr == 0
        ? 12
        : time.hr;
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "hour",
      "innerHTML",
      time.hr + ":" + time.min
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "sec",
      "innerHTML",
      ":" + time.sec
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "time-icon",
      "src",
      time.timeIcon
    );
  }
  /**
   * To display the weather for next five hours with respect to the selected city
   * @return {void} nothing
   */
  async updateTimeWeather() {
    let selectedCityTemperature = await getCityWeather(selectedCity);
    selectedCity = document.getElementById("city").value;
    if (selectedCity.toLowerCase() !== this.selectedCity.toLowerCase()) {
      updateCityWeatherInfo();
      alert(
        "Invalid URL city details not fetched 'Vienna details are displayed"
      );
    }
    this.hourWeather[0].innerHTML =
      selectedCityData.getTemperatureOfSelectedCity();
    selectedCityData.displayWeatherIcon(
      selectedCityData.getTemperatureOfSelectedCity()
    );

    /**
     * To display the temperature with respect to time
     * @param {number} increaseInTime has the time with which the weather will be displayed
     * @return {void} nothing
     */
    let updateDisplay = function displayTemperature(increaseInTime) {
      let temperatureToDisplay = parseInt(
        selectedCityTemperature.temperature[increaseInTime - 1]
      );
      selectedCityData.hourWeather[increaseInTime].innerHTML =
        temperatureToDisplay;
      selectedCityData.displayWeatherIcon(temperatureToDisplay, increaseInTime);
      increaseInTime++;
      if (increaseInTime <= 5) {
        displayTemperature(increaseInTime);
      }
    };
    updateDisplay(1);
    this.weatherTime[0].innerHTML = this.currentTimeLabel;
  }

  /**
   * To display the temperature in celcius and fahrenheit, humidity and precipitation
   * @return {void} nothing
   */
  updateClimateCont() {
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "temp-C",
      "innerHTML",
      selectedCityData.getTemperatureOfSelectedCity() + " C"
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "temp-F",
      "innerHTML",
      convertCelciusToFahrenheit().toFixed(1) + " F"
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "humid",
      "innerHTML",
      parseInt(selectedCityData.getHumidityOfSelectedCity())
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "preci",
      "innerHTML",
      parseInt(selectedCityData.getPrecipitationOfSelectedCity())
    );

    /**
     * To convert the temperature from degree celcius to Fahrenheit scale
     * @return {number} currentTemperatureInF
     */
    function convertCelciusToFahrenheit() {
      return selectedCityData.getTemperatureOfSelectedCity() * 1.8 + 32;
    }
  }
  /**
   * To display the weather icon for the next five hours with respect to the temperature
   * @param {number} temperatureToDisplay temperature in a particular time in degree celcius
   * @param {number} [timeInterval=0] temporary variable incrementing the time for the next five hours
   * @return {void} nothing
   */
  displayWeatherIcon(temperatureToDisplay, timeInterval = 0) {
    let weatherIcon =
      temperatureToDisplay < 18
        ? `./assets/rainyIcon.svg`
        : temperatureToDisplay <= 22
        ? `./assets/windyIcon.svg`
        : temperatureToDisplay <= 29
        ? `./assets/cloudyIcon.svg`
        : `./assets/sunnyIconBlack.svg`;
    this.climateIcon[timeInterval].src = weatherIcon;
  }
  /**
   * To display the time in hour for the next five hours with AM and PM notation
   * @param {number} timeInterval temporary variable incrementing the time for the next five hours
   * @param {number} currentTime live time of the selected city
   * @return {void} nothing
   */
  displayTimeInWeatherCont(timeInterval, currentTime) {
    let timeToDisplay = parseInt(currentTime) + parseInt(timeInterval);
    timeToDisplay =
      timeToDisplay < 12
        ? timeToDisplay + "AM"
        : timeToDisplay == 12
        ? timeToDisplay + " PM"
        : timeToDisplay < 24
        ? timeToDisplay - 12 + " PM"
        : timeToDisplay == 24
        ? timeToDisplay - 12 + " AM"
        : timeToDisplay - 24 + " AM";
    this.weatherTime[timeInterval].innerHTML = timeToDisplay;
  }
  /**
   * To display Nil if the selected city name is invalid
   * @param {}
   * @return {void} nothing
   */
  updateUIWithNIL() {
    clearInterval(timeout);
    alert("Please Enter valid City Name");
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "city-icon",
      "src",
      this.warningImagePath
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "time-icon",
      "src",
      this.warningImagePath
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "date",
      "innerHTML",
      this.nullValue
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "hour",
      "innerHTML",
      this.nullValue
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "sec",
      "innerHTML",
      ""
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "temp-C",
      "innerHTML",
      this.nullValue
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "temp-F",
      "innerHTML",
      this.nullValue
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "humid",
      "innerHTML",
      this.nullValue
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "preci",
      "innerHTML",
      this.nullValue
    );
    selectedCityData.displayWeatherNull(0, this.nullValue);
  }
  /**
   * To display the weather container details as warning image and nil when the selected city name is invalid
   * @param {number} iterate number incremented to fill the weather container which gives details for the next five hours
   * @return {void} nothing
   */
  displayWeatherNull(iterate, nullValue) {
    if (iterate <= 5) {
      this.climateIcon[iterate].src = this.warningImagePath;
      this.weatherTime[iterate].innerHTML = nullValue;
      this.hourWeather[iterate].innerHTML = nullValue;
      selectedCityData.displayWeatherNull(iterate + 1, nullValue);
    }
  }
  /**
   * To update the current time and date with respect to the live data
   * @param {}
   * @return {void} nothing
   */
  updateDateTime() {
    let currentDate = new Date();
    currentDate = new Date(
      currentDate.toLocaleString("en-US", {
        timeZone: selectedCityData.getTimeZoneOfSelectedCity(),
      })
    );
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "date",
      "innerHTML",
      selectedCityData.appendZero(currentDate.getDate()) +
        "-" +
        new Date(currentDate).toLocaleString("en-US", { month: "short" }) +
        "-" +
        currentDate.getFullYear()
    );
    selectedCityData.displayCurrentTime(currentDate);
    for (let iterate = 1; iterate <= 5; iterate++) {
      selectedCityData.displayTimeInWeatherCont(
        iterate,
        currentDate.getHours()
      );
    }
  }
}

/**
 * To update the change in weather information with respect to selected city
 * @param {}
 * @return {void} nothing
 */
function updateCityWeatherInfo() {
  /**
   * To update the change in weather container for the selectedCity
   * @param {}
   * @return {void} nothing
   */
  function displayCurrentWeather() {
    selectedCity = document.getElementById("city").value;
    selectedCityData = new SetSelectedCityDetails();
    selectedCityData.updateUIElementAttributeWithGivenValue(
      "city-icon",
      "src",
      selectedCityData.getIconPathOfSelectedCity()
    );
    selectedCityData.updateDateTime();
    selectedCityData.updateTimeWeather();
    setInterval(async () => {
      document.getElementById("main-container").style.display = "none";
      document.body.style.backgroundImage = 'url("./assets/weather.gif")';
      document.body.style.backgroundPosition = "center top";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "60%";
      await selectedCityData.updateTimeWeather();
    }, 3.6e6);
    selectedCityData.updateClimateCont();
    clearInterval(timeout);
    timeout = setInterval(selectedCityData.updateDateTime, 1000);
  }
  cityNames.includes(document.getElementById("city").value.toLowerCase())
    ? displayCurrentWeather()
    : selectedCityData.updateUIWithNIL();
}

SetSelectedCityDetails.prototype.updateUIElementAttributeWithGivenValue =
  updateUIElementAttributeWithGivenValue;
SetSelectedCityDetails.prototype.appendZero = appendZero;

/**
 * Constructor function to store all the functions
 */
class cityClimateData extends SetSelectedCityDetails {
  sunnyCities = [];
  coldCities = [];
  rainyCities = [];
  cityList = [];
  cityNameDisplay = [];
  cityCount;
  citiesSelected = "sunnyCities";
  currentWeatherDisplayIcon = "sunnyIcon";
  iconPath = `./assets/sunnyIcon.svg`;
  selectIcon = document.getElementsByClassName("icon");
  scrollArrow = document.getElementsByClassName("scroll-icon");
  spinCard = document.getElementById("count");
  scrollCard = document.getElementById("card-cont");

  //For Bottom
  weatherDisplayData = [];
  continentListWithCity = [];
  continentSort = "down";
  temperatureSort = "up";
  cityTimeToDisplay = document.getElementsByClassName("city-time");
  arrowDisplay = document.getElementsByClassName("arrow");

  constructor() {
    super();
  }
  /**
   * Update the spinner value to change the number of cards
   * Create and display the contents in the card
   * @param {}
   * @return {void} nothing
   */
  displayCardOnCityCountChange() {
    climateData.cityCount =
      climateData.cityList.length > climateData.spinCard.value
        ? climateData.spinCard.value
        : climateData.cityList.length;
    climateData.createDisplayCard();
  }
  /**
   * To update the boarder for the selected icon
   * To display the city details with the respective climate in card
   * Create and display the contents in the card
   * @param {string} currentClimateIcon denotes the climate choosen
   * @param {array} currentClimateCities list of cities with chosen climate
   * @param {number} iconBorderToReflectOnUI icon for which boarder to be displayed
   * @param {number} iconWithoutBorder1 icon which is not chosen, displayed without boarder
   * @param {number} [iconWithoutBorder2=0] icon which is not chosen, displayed without boarder
   */
  displayCities(
    currentClimateIcon,
    currentClimateCities,
    iconBorderToReflectOnUI,
    iconWithoutBorder1,
    iconWithoutBorder2 = 0
  ) {
    if (
      currentClimateCities !== climateData.citiesSelected ||
      currentClimateCities === "sunnyCities"
    ) {
      climateData.selectIcon[iconBorderToReflectOnUI].style.borderBottom =
        "3px solid rgb(4,151,189)";
      climateData.selectIcon[iconWithoutBorder1].style.borderStyle = "none";
      climateData.selectIcon[iconWithoutBorder2].style.borderStyle = "none";
    }
    this.currentWeatherDisplayIcon = currentClimateIcon;
    climateData.citiesSelected = currentClimateCities;
    this.cityList =
      currentClimateCities === "sunnyCities"
        ? this.sunnyCities
        : currentClimateCities === "rainyCities"
        ? this.rainyCities
        : this.coldCities;
    climateData.cityCount =
      this.cityList.length < 10
        ? this.cityList.length > 3
          ? this.spinCard.value
          : 3
        : 10;
    climateData.spinCard.value =
      climateData.cityList.length <= 3 ? 3 : climateData.spinCard.value;
    climateData.spinCard.max =
      climateData.cityList.length <= 3
        ? 3
        : climateData.cityList.length >= 10
        ? 10
        : climateData.cityList.length;
    climateData.cityCount =
      climateData.cityList.length > climateData.spinCard.value
        ? climateData.spinCard.value
        : climateData.cityList.length;
    climateData.createDisplayCard();
  }
  /**
   * To sort the cities with their weather order such as temperature and humidity
   * To select the cities based on the climate data available
   * @param {}
   * @return {void} nothing
   */
  sortCities() {
    let allCities = [];
    // Loop to fetch all city data
    for (const cities in data) {
      allCities.push(cities);
    }
    this.sunnyCities = allCities.filter(climateData.getSunnyCities);
    this.coldCities = allCities.filter(climateData.getColdCities);
    this.rainyCities = allCities.filter(climateData.getRainyCities);
    climateData.sortCityWithWeather(this.sunnyCities, "temperature");
    climateData.sortCityWithWeather(this.rainyCities, "humidity");
    climateData.sortCityWithWeather(this.coldCities, "precipitation");
  }
  /**
   * To arrange the cities with the respective climate group.
   * @param {array} cityNameList contains array of cities which is to be sorted
   * @param {string} weatherType is a key to access the climate data
   * @return {void} nothing
   */
  sortCityWithWeather(cityNameList, weatherType) {
    cityNameList.sort((current, next) => {
      return (
        parseInt(data[next][weatherType]) - parseInt(data[current][weatherType])
      );
    });
  }
  /**
   * To state whether the city passed satisfies the condition of the sunny weather climate
   * @param {string} cityname is a key attribute to access the contents in the data
   * @return {boolean} value to state whether the condition satisfies
   */
  getSunnyCities(cityname) {
    return (
      parseInt(data[cityname].temperature) > 29 &&
      parseInt(data[cityname].humidity) < 50 &&
      parseInt(data[cityname].precipitation) >= 50
    );
  }
  /**
   * To state whether the city passed satisfies the condition of the cold weather climate
   * @param {string} cityname is a key attribute to access the contents in the data
   * @return {boolean} value to state whether the condition satisfies
   */
  getColdCities(cityname) {
    return (
      parseInt(data[cityname].temperature) >= 20 &&
      parseInt(data[cityname].temperature) <= 28 &&
      parseInt(data[cityname].humidity) > 50 &&
      parseInt(data[cityname].precipitation) < 50
    );
  }
  /**
   * To state whether the city passed satisfies the condition of the rainy weather climate
   * @param {string} cityname is a key attribute to access the contents in the data
   * @return {boolean} value to state whether the condition satisfies
   */
  getRainyCities(cityname) {
    return (
      parseInt(data[cityname].temperature) < 20 &&
      parseInt(data[cityname].humidity) >= 50
    );
  }
  /**
   * To create card and display content in the card according to the selected values
   * Update the selectbox value if the number of cities is less than the maximum value
   * @param {}
   * @return {void} nothing
   */
  createDisplayCard() {
    setInterval(climateData.displayScrollIcon, 1);
    this.iconPath = `./assets/${this.currentWeatherDisplayIcon}.svg`;
    this.cityNameDisplay = this.cityList.slice(0, climateData.cityCount); //Array Method
    climateData.createCard();
    climateData.displayCard();
  }
  /**
   * To create the card with respect to the number of cities and the spinner value
   * Creates a continuous execution to update the live time and date
   * @param {}
   * @return {void} nothing
   */
  createCard() {
    climateData.cityCount -= 1;
    const cloneCard = document.getElementById("card-clone");
    const card = document.querySelector(".weather-elt");
    cloneCard.replaceChildren();
    // Loop to clone(duplicate) card
    for (let iterate = 0; iterate < climateData.cityCount; iterate++) {
      cloneCard.appendChild(card.cloneNode(true));
    }
    climateData.cityCount += 1;
    setInterval(climateData.updateLiveDateTime, 1000);
  }
  /**
   * To display the scroll arrow icon when overflow occurs
   * @param {}
   * @return {void} nothing
   */
  displayScrollIcon() {
    if (
      climateData.scrollCard.scrollWidth > climateData.scrollCard.clientWidth
    ) {
      climateData.scrollArrow[0].style.display = "block";
      climateData.scrollArrow[1].style.display = "block";
    } else {
      climateData.scrollArrow[0].style.display = "none";
      climateData.scrollArrow[1].style.display = "none";
    }
  }
  /**
   * To display the data of cities in the card with-respect to the values selected in the UI
   * @param {}
   * @return {void} nothing
   */
  displayCard() {
    let iterate = 0;
    let currentCityTemperature;
    let currentCityPrecipitation;
    let currentCityHumidity;
    let currentCityName;
    const cityToDisplay = document.getElementsByClassName("place");
    const cityClimateIconDisplay =
      document.getElementsByClassName("city-climate-icon");
    const cityTemperature = document.getElementsByClassName("climate-temp");
    const cityHumidity = document.getElementsByClassName("humidity");
    const cityPrecipitation = document.getElementsByClassName("precipitation");
    const cityIcon = document.getElementsByClassName("weather-elt");
    // Loop to display cities data in card
    for (let cityKey of climateData.cityNameDisplay) {
      currentCityName = data[cityKey].cityName;
      currentCityTemperature = data[cityKey].temperature;
      currentCityHumidity = data[cityKey].humidity;
      currentCityPrecipitation = data[cityKey].precipitation;
      cityToDisplay[iterate].innerHTML = currentCityName;
      cityClimateIconDisplay[iterate].src = this.iconPath;
      cityTemperature[iterate].innerHTML = parseInt(currentCityTemperature);
      cityHumidity[iterate].innerHTML = currentCityHumidity;
      cityPrecipitation[iterate].innerHTML = currentCityPrecipitation;
      cityIcon[
        iterate
      ].style.background = `rgb(35 34 34) url(./assets/${currentCityName.toLowerCase()}.svg) no-repeat bottom right`;
      cityIcon[iterate].style.backgroundSize = "9rem";
      climateData.updateDateAndTime(cityKey, iterate);
      iterate += 1;
    }
  }
  /**
   * To fetch and update the live date and time for displaying cities
   * @param {}
   * @return {void} nothing
   */
  updateLiveDateTime() {
    let iterate = 0;
    for (let cityKey of climateData.cityNameDisplay) {
      climateData.updateDateAndTime(cityKey, iterate);
      iterate += 1;
    }
  }
  /**
   * To update the live date and time for the city passed with thier respective timezone.
   * @param {string} cityKey is a key attribute to fetch data from data.json
   * @param {number} iterate denotes the number of iterations
   * @return {void} nothing
   */
  updateDateAndTime(cityKey, iterate) {
    let currentCityDate = new Date();
    let timeZoneOfCity = data[cityKey].timeZone;
    const cityDate = document.getElementsByClassName("mid-date");
    const cityTime = document.getElementsByClassName("mid-time");
    currentCityDate = new Date(
      currentCityDate.toLocaleString("en-US", { timeZone: timeZoneOfCity })
    );
    cityDate[iterate].innerHTML = climateData.updateCityDate(currentCityDate);
    cityTime[iterate].innerHTML = climateData.updateCityTime(currentCityDate);
  }
  /**
   * To update the live date of specific city
   * @param {array} currentCityDate live date which is to be converted into specific formate
   * @return {string} updated date of the city in the specific formate to be displayed
   */
  updateCityDate(currentCityDate) {
    let currentCityDay = currentCityDate.getDate();
    let currentCitymonth = new Date(currentCityDate).toLocaleString("en-US", {
      month: "short",
    });
    currentCityDay = selectedCityData.appendZero(currentCityDate.getDate());
    let currentUpdatedDate =
      currentCityDay +
      "-" +
      currentCitymonth +
      "-" +
      currentCityDate.getFullYear();
    return currentUpdatedDate;
  }
  /**
   * To update the live time of specific city
   * @param {array} currentCityDate live date and time in which the time is to be converted into specific formate
   * @return {string} updated time of the city in the specific formate to be displayed
   */
  updateCityTime(currentCityDate) {
    const separator = ":";
    let hourToDisplay = climateData.appendZero(currentCityDate.getHours());
    let state = hourToDisplay >= 12 ? "PM" : "AM";
    let time;
    hourToDisplay =
      hourToDisplay > 12
        ? climateData.appendZero(hourToDisplay - 12)
        : hourToDisplay == 0
        ? 12
        : hourToDisplay;
    let timeToDisplay = {
      hour: hourToDisplay,
      minute: climateData.appendZero(currentCityDate.getMinutes()),
      meridiem: state,
    };
    time = displayTime.call(timeToDisplay); // call function method
    function displayTime() {
      return this.hour + separator + this.minute + " " + this.meridiem; //closure
    }
    return time;
  }
  /**
   * To create and display the city details when clicking the respective weather icon
   * To control the overflow display by using scroll arrow
   */
  displayMiddle() {
    climateData.selectIcon[2].addEventListener("click", () => {
      climateData.displayCities("sunnyIcon", "sunnyCities", 2, 1);
    });
    climateData.selectIcon[1].addEventListener("click", () => {
      climateData.displayCities("snowflakeIcon", "coldCities", 1, 2);
    });
    climateData.selectIcon[0].addEventListener("click", () => {
      climateData.displayCities("rainyIcon", "rainyCities", 0, 1, 2);
    });
    climateData.scrollArrow[0].addEventListener("click", () => {
      setTimeout((climateData.scrollCard.scrollLeft -= 630), 200); //set Timeout
    });
    climateData.scrollArrow[1].addEventListener("click", () => {
      setTimeout((climateData.scrollCard.scrollLeft += 630), 200); //set Timeout
    });
    document
      .getElementById("count")
      .addEventListener("change", climateData.displayCardOnCityCountChange);
    climateData.sortCities();
    climateData.displayCities(
      this.currentWeatherDisplayIcon,
      climateData.citiesSelected,
      2,
      1
    );
  }
  /**
   * To get the continent name from the dataset
   * To remove duplicates in the continent list
   * @param {}
   * @return {void} nothing
   */
  fetchContinentNames() {
    let continentName;
    climateData.continentListWithCity = [];
    climateData.weatherDisplayData = [];
    for (const cities in data) {
      continentName = data[cities].timeZone;
      continentName = continentName.split("/");
      continentName[1] = continentName[1].toLowerCase().replace("_", "");
      climateData.continentListWithCity.push(continentName);
    }
    climateData.continentList = climateData.continentListWithCity.map(
      (continent) => {
        return continent[0];
      }
    );
    climateData.continentList.sort();
    climateData.continentList = [...new Set(climateData.continentList)];
  }
  /**
   * To create the number of cards needed for displaying the weather details
   * Card is done by duplicating the copy from the HTML file
   * @param {}
   * @return {void} nothing
   */
  createBottomCards() {
    const card = document.querySelector(".location-weather");
    const cloneCardBottom = document.getElementById("country-weather");
    for (let iterate = 1; iterate < 12; iterate++) {
      cloneCardBottom.appendChild(card.cloneNode(true));
    }
  }
  /**
   * Create objects which contains cities and their respective continent name
   * Append all the city names and continent names in the common data
   * @param {}
   * @return {void} nothing
   */
  createDataGrouping() {
    let continentAndCity;
    for (let continentCount in climateData.continentList) {
      continentAndCity = {
        continent: climateData.continentList[continentCount],
        citiesList: climateData.getCityList(
          climateData.continentList[continentCount]
        ),
      };
      climateData.weatherDisplayData.push(continentAndCity);
    }
  }
  /**
   * To select the cities which are in the specific continent
   * To arrange the citie names with the respective temperature order
   * @param {string} continentName contains the name of the continent which cities are to be fetched.
   * @return {array} list of cities in that continent
   */
  getCityList(continentName) {
    let continentCityList = [];
    for (let cityCount in climateData.continentListWithCity) {
      if (climateData.continentListWithCity[cityCount][0] === continentName) {
        continentCityList.push(climateData.continentListWithCity[cityCount][1]);
      }
    }
    if (continentCityList.length > 1) {
      continentCityList.sort((current, next) => {
        return (
          parseInt(data[next].temperature) - parseInt(data[current].temperature)
        );
      });
    }
    return continentCityList;
  }
  /**
   * To arrange the cities according to the selected order of continent from UI
   * To display the sort arrow according to the input from the UI
   * @param {}
   * @return {void} nothing
   */
  citiesSortWithContinent() {
    climateData.continentSort =
      climateData.continentSort === "up" ? "down" : "up";
    let sortArrowPath =
      climateData.continentSort == "down"
        ? `./assets/arrow-down.png`
        : `./assets/arrow-up.png`;
    climateData.arrowDisplay[0].src = sortArrowPath;
    climateData.continentList.reverse();
    climateData.weatherDisplayData.reverse();
    climateData.displayDataInCard();
  }
  /**
   * To arrange the cities according to the selected order of temperature from UI
   * Arrange it according to the given UI input
   * @param {}
   * @return {void} nothing
   */
  citiesSortWithTemperature() {
    climateData.temperatureSort =
      climateData.temperatureSort === "up" ? "down" : "up";
    let sortArrowPath =
      climateData.temperatureSort == "up"
        ? `./assets/arrow-up.png`
        : `./assets/arrow-down.png`;
    climateData.arrowDisplay[1].src = sortArrowPath;
    for (let continentCount in climateData.continentList) {
      climateData.weatherDisplayData[continentCount].citiesList =
        climateData.getCitiesNameList
          .call(climateData.weatherDisplayData[continentCount])
          .reverse();
    }
    climateData.displayDataInCard();
  }
  /**
   * To fetch the city name list from object which are in same continent
   * @param {}
   * @return {array} array contains the cities of the particular continent
   */
  getCitiesNameList() {
    return this.citiesList;
  }
  /**
   * To display the data in the card with respect to selected city order and temperature order which is selected from the user end.
   * Fetch live date and timeusing the timeZone and print it in the needed format.
   * @param {}
   * @return {void} nothing
   */
  displayDataInCard() {
    const continentNameToDisplay = document.getElementsByClassName("continent");
    const cityTemperatureToDisplay =
      document.getElementsByClassName("city-temp");
    const cityHumidityToDisplay = document.getElementsByClassName("humid-val");
    let iterate = 0;
    let continentCityList;
    for (let continentsCount in climateData.continentList) {
      continentCityList = climateData.getCitiesNameList.call(
        climateData.weatherDisplayData[continentsCount]
      );
      continentCityList =
        iterate + continentCityList.length > 12
          ? continentCityList.slice(0, 12 - iterate)
          : continentCityList;
      for (let citiesOfContinent of continentCityList) {
        let currentDate = new Date();
        currentDate = new Date(
          currentDate.toLocaleString("en-US", {
            timeZone: data[citiesOfContinent].timeZone,
          })
        );
        continentNameToDisplay[iterate].innerHTML =
          climateData.continentList[continentsCount];
        cityTemperatureToDisplay[iterate].innerHTML = parseInt(
          data[citiesOfContinent].temperature
        );
        climateData.cityTimeToDisplay[iterate].innerHTML =
          data[citiesOfContinent].cityName +
          ", " +
          climateData.updateCityTime(currentDate);
        cityHumidityToDisplay[iterate].innerHTML =
          data[citiesOfContinent].humidity;
        iterate++;
      }
    }
  }
  updateData() {
    climateData.fetchContinentNames();
    climateData.createDataGrouping();
    if (climateData.continentSort == "up") {
      climateData.continentList.reverse();
      climateData.weatherDisplayData.reverse();
    }
    if (climateData.temperatureSort == "down") {
      for (let continentCount in climateData.continentList) {
        climateData.weatherDisplayData[continentCount].citiesList =
          climateData.getCitiesNameList
            .call(climateData.weatherDisplayData[continentCount])
            .reverse();
      }
    }
    climateData.displayDataInCard();
  }
  /**
   *To display the live time of the cities
   */
  updateCurrentTime() {
    let iterate = 0;
    let continentCityList;
    for (let continentsCount in climateData.continentList) {
      continentCityList = climateData.getCitiesNameList.call(
        climateData.weatherDisplayData[continentsCount]
      );
      continentCityList =
        iterate + continentCityList.length > 12
          ? continentCityList.slice(0, 12 - iterate)
          : continentCityList;
      for (let citiesOfContinent of continentCityList) {
        let currentDate = new Date();
        currentDate = new Date(
          currentDate.toLocaleString("en-US", {
            timeZone: data[citiesOfContinent].timeZone,
          })
        );
        climateData.cityTimeToDisplay[iterate].innerHTML =
          data[citiesOfContinent].cityName +
          ", " +
          climateData.updateCityTime(currentDate);
        iterate++;
      }
    }
  }
  /**
   * To get the continent names
   * To create cards
   * To create data to be displayed
   * To arrange the data in the particular given order either in ascending or descending
   * To display the data in the card
   */
  displayBottom() {
    const arrowSort = document.getElementsByClassName("sort-arrow");
    climateData.fetchContinentNames();
    climateData.createBottomCards();
    climateData.createDataGrouping();
    arrowSort[0].addEventListener("click", climateData.citiesSortWithContinent);
    arrowSort[1].addEventListener(
      "click",
      climateData.citiesSortWithTemperature
    );
    climateData.displayDataInCard();
    setInterval(climateData.updateCurrentTime, 1000);
  }
}

/**
 * To display the weather of selected city
 * Display a dynamic dropdown selection box to select the city name.
 * Default display of bottom and middle container
 */
(async () => {
  document.getElementById("main-container").style.display = "none";
  document.body.style.backgroundImage = 'url("./assets/weather.gif")';
  document.body.style.backgroundPosition = "center top";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "60%";
  async function displayAndUpdateData() {
    data = await getCityData();
    updateCityWeatherInfo();
    climateData.displayMiddle();
    climateData.updateData();
  }
  data = await getCityData();
  setInterval(async () => {
    await displayAndUpdateData();
  }, 1.44e7);
  climateData = new cityClimateData();
  const cityList = document.getElementById("city-list");
  for (const cities in data) {
    const options = document.createElement("OPTION");
    options.value = data[cities].cityName;
    let cityInLowerCase = data[cities].cityName.toLowerCase();
    cityNames.push(cityInLowerCase);
    cityList.appendChild(options);
  }
  document
    .getElementById("city")
    .addEventListener("change", updateCityWeatherInfo);
  updateCityWeatherInfo();
  document.getElementById("count").value = 3;
  climateData.displayMiddle();
  climateData.displayBottom();
})();
