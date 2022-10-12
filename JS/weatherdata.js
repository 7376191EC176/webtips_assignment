/**
 * To fetch the data of all the cities from the api
 * @return {object} containes data of all the cities
 */
function dataOfAllCities() {
  let dataOfAllCities = new Promise(async (resolve, reject) => {
    let cityData = await fetch(`https://eight-flicker-rose.glitch.me/all-timezone-cities`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    resolve(cityData);
    reject("error");
  });
  return dataOfAllCities;
}

/**
 * To fetch the details of the selected city
 * @param {string} selectedCity city which is selected in the UI display
 * @return {object} returns the data of the given city
 */
async function getSelectedCityData(selectedCity) {
  try {
    let selectedCityData = await fetch(
      `https://eight-flicker-rose.glitch.me/city/?city=${selectedCity}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    return selectedCityData;
  } catch (error) {
    alert(error.message);
  }
}

/**
 * To fetch the future temperature of the city
 * @return {object} return the default city temperature values
 */
async function getViennaCityData() {
  let selectedCityData = await fetch(
    `https://eight-flicker-rose.glitch.me/city/?city=Vienna`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }
  );
  return selectedCityData;
}

/**
 * To fetch the temperature for the next 5 hours of the selected city
 * @param {string} cityAndTime contains data of the selected city
 * @return {object} contains the temperature for the next five hours
 */
async function getSelectedCityWeather(cityAndTime) {
  let selectedCityWeatherData = await fetch(
    "https://eight-flicker-rose.glitch.me/hourly-forecast",
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        city_Date_Time_Name: cityAndTime,
        hours: 5,
      }),
    }
  );
  return selectedCityWeatherData;
}

/**
 * To fetch and return the data of all the cities
 * @return {object} contains the data of all the given cities
 */
async function getCityData() {
  let data = {};
  let fetchDataFromAPI = await dataOfAllCities();
  fetchDataFromAPI = await fetchDataFromAPI.json();
  await fetchDataFromAPI.forEach((element) => {
    data[element.cityName.toLowerCase()] = element;
  });
  return data;
}

/**
 * To fetch and return the future temperature of the selected city.
 * @param {string} selectedCity city which is selected by the user
 * @return {object} returns the temperature of the next five hours
 */
async function getCityWeather(selectedCity) {
  let fetchData = await getSelectedCityData(selectedCity);
  fetchData = await fetchData.json();
  let fetchfuturetemperature;
  if (fetchData === "error") {
    fetchData = await getViennaCityData();
    fetchData = fetchData.json();
    document.getElementById("city").value = "Vienna";
  }
  fetchfuturetemperature = await getSelectedCityWeather(
    fetchData.city_Date_Time_Name
  );
  fetchfuturetemperature = await fetchfuturetemperature.json();
  document.getElementById("main-container").style.display = "block";
  document.body.style.backgroundImage = 'url("./assets/background.svg")';
  document.body.style.backgroundSize = "100%";
  return fetchfuturetemperature;
}
export { getCityData, getCityWeather };
