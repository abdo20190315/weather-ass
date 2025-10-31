const input = document.querySelector("#cityInput");
const weatherResult = document.querySelector("#weatherResult");
const API_KEY = "34012e1a00da433c9f4221412252810";

let typingTimer;
const delay = 700;



input.addEventListener("input", function () {
  clearTimeout(typingTimer);
  const city = input.value.trim();
  if (city.length >= 2) {
    typingTimer = setTimeout(() => searchCity(city), delay);
  } else if (city === "") {

    getWeather("القاهرة"); 
  }
});

async function searchCity(query) {
  try {
    const searchURL = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(
      query
    )}`;

    const searchResponse = await fetch(searchURL);
    const searchData = await searchResponse.json();

    if (searchData.length === 0) {
      return;     
    }

    const bestMatch = searchData[0].name;

    getWeather(bestMatch, "ar");
  } catch {
  }
}

async function getWeather(city, lang = "ar") {
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(
      city
    )}&days=3&lang=${lang}`;

    const response = await fetch(url);
    const data = await response.json();

    showWeather(data);
  } catch {
  }
}

function showWeather(data) {
  const days = data.forecast.forecastday;

  let cartona = "";

  days.forEach((dayObj, index) => {
    const date = new Date(dayObj.date);
    const weekday = date.toLocaleDateString("ar-EG", { weekday: "long" });
    const condition = dayObj.day.condition.text;
    const icon = "https:" + dayObj.day.condition.icon;
    const max = dayObj.day.maxtemp_c;
    const min = dayObj.day.mintemp_c;

    const cityName =
      index === 0
        ? `<h3 class="mb-3">${data.location.name}, ${data.location.country}</h3>`
        : "";

    cartona += `
      <div class="col-md-3">
        <div class="card bg-secondary text-white text-center p-3 h-100 shadow">
          ${cityName}
          <h5>${weekday}</h5>
          <img src="${icon}" alt="${condition}" width="80" class="mx-auto d-block my-2" />
          <h4>${max}°C / ${min}°C</h4>
          <p class="mb-0">${condition}</p>
        </div>
      </div>
    `;
  });

  weatherResult.innerHTML = cartona;
}

getWeather("cairo");
