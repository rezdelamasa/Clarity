// Function for fetching data from forecasts api using location data from another endpoint
function getForecast(locationData, key) {
  const ForecastHttp = new XMLHttpRequest();
  
  const forecastUrl="https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + key + "?apikey=bjZRaoG2XJ2rz78s9ObctUI56lhL62yv&details=true";
  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      if(document.querySelector(".forecast")) {
        document.querySelector(".forecast").remove();
      }
      createAirMessage(data.DailyForecasts[0].AirAndPollen, data.DailyForecasts[0].AirAndPollen[0]);
      console.log(data.DailyForecasts[0].AirAndPollen[5]);
      createUVMessage(data.DailyForecasts[0].AirAndPollen[5]);
      createAirForecastList(data);
      createUVForecastList(data);
      console.log(data);
    });
}

// Convert epoch from api data to day name
function epochToDay(epoch) {
  let dayObject = {};
  const ms = epoch;
  const date = new Date(0);
  date.setUTCSeconds(epoch);
  let dateString = date + "";
  let dateArray = [];
  dateArray = dateString.split(" ");
  dateString = dateArray[0];
  dateArray.push(dateString);
  return dateString;
}

// Loop through data and call function createTextElement to create a "P" element for each needed piece of info
function loopAirInfoLi(d) {
  let infoUl = document.createElement("UL");
  var labelStr = "";
  var valueStr = "";
  for(var i = 0; i < d.AirAndPollen.length; i++) {
    var pollenAvg = 0;
    if(d.AirAndPollen[i].Name == "AirQuality" || d.AirAndPollen[i].Name == "Grass" || d.AirAndPollen[i].Name == "Ragweed" || d.AirAndPollen[i].Name == "Tree") {
      if(d.AirAndPollen[i].Name == "AirQuality") {
        labelStr = "Air Quality";
      } else {
        labelStr = d.AirAndPollen[i].Name;
      }
      valueStr = d.AirAndPollen[i].Category;
      infoUl.appendChild(createInfoLiElements(valueStr, d.AirAndPollen[i].CategoryValue, labelStr));
    }
  } 
  infoUl.classList.add("forecast__info");
  return infoUl;
}

// Loop through uv info and call another function to create LI elements for each piece of UV Index info
function loopUVInfoLi(d) {
  let infoUl = document.createElement("UL");
  var labelStr = "";
  var valueStr = "";
  for(var i = 0; i < d.AirAndPollen.length; i++) {
    var pollenAvg = 0;
    if(d.AirAndPollen[i].Name == "UVIndex") {
      labelStr = "UV Index";
      valueStr = d.AirAndPollen[i].CategoryValue;
      infoUl.appendChild(createInfoLiElements(valueStr, d.AirAndPollen[i].CategoryValue, labelStr));
    }
  } 
  infoUl.classList.add("forecast__info");
  return infoUl;
}

// Get info from data regarding air and pollen and add respective text to each day "LI"
function createInfoLiElements(v, cv, l) {
  let infoLiElement = document.createElement("LI");
  let labelElement = document.createElement("H4");
  let valueElement = document.createElement("P");
  
  let labelText = document.createTextNode(l);
  labelElement.appendChild(labelText);
  labelElement.classList.add("forecast__label");
  let valueText = document.createTextNode(v);
  
  valueElement.appendChild(valueText);
  valueElement.classList.add("forecast__value");
  switch(cv) {
    case 1:
      valueElement.classList.add("forecast__value--1");
      break;
    case 2:
      valueElement.classList.add("forecast__value--2");
      break;
    case 3:
      valueElement.classList.add("forecast__value--3");
      break;
    case 4:
      valueElement.classList.add("forecast__value--4");
      break;
    case 5:
      valueElement.classList.add("forecast__value--5");
      break;
    case 6:
      valueElement.classList.add("forecast__value--6");
      break;
  }
  
  infoLiElement.appendChild(labelElement);
  infoLiElement.appendChild(valueElement);
  infoLiElement.classList.add("forecast__li");
  return infoLiElement;
}

// Function to create li element for each object in data
function createAirLiElement(d) {
  let li = document.createElement("LI");
  li.classList.add("forecast__item");
  console.log(epochToDay(d.EpochDate));
  let daySubheadingText = document.createElement("H3");
  daySubheadingText.classList.add("forecast__subheading");
  let dayText = document.createTextNode(epochToDay(d.EpochDate));
  daySubheadingText.appendChild(dayText);
  li.appendChild(daySubheadingText);
  li.appendChild(loopAirInfoLi(d));
  return li;
}

// Function to create li element for each object in data
function createUVLiElement(d) {
  let li = document.createElement("LI");
  li.classList.add("forecast__item");
  console.log(epochToDay(d.EpochDate));
  let daySubheadingText = document.createElement("H3");
  daySubheadingText.classList.add("forecast__subheading");
  let dayText = document.createTextNode(epochToDay(d.EpochDate));
  daySubheadingText.appendChild(dayText);
  li.appendChild(daySubheadingText);
  li.appendChild(loopUVInfoLi(d));
  return li;
}

// Create ul on dom for 5 day forecast
function createAirForecastList(data) {
  let dayList = document.createElement("UL");
  
  let dayArray = [];
  
  data.DailyForecasts.forEach(function(d) {
    dayList.appendChild(createAirLiElement(d));
    dayList.classList.add("forecast");
    
  });
  
  document.querySelector("#AirQuality").appendChild(dayList);
}

// create ul on dom for 5 day forecast of UVIndex
function createUVForecastList(data) {
  let dayList = document.createElement("UL");

  data.DailyForecasts.forEach(function(d) {
    dayList.appendChild(createUVLiElement(d));
    dayList.classList.add("forecast");
  });

  if(document.querySelector('#UVIndex').children.length > 1) {
    document.querySelector('#UVIndex').removeChild(document.querySelector('#UVIndex').lastChild);
  }

  document.querySelector("#UVIndex").appendChild(dayList);
}

document.querySelector(".form").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const search = document.querySelector(".form__input").value;
  
  const apiKey = "bjZRaoG2XJ2rz78s9ObctUI56lhL62yv";
  const locationUrl="https://dataservice.accuweather.com/locations/v1/cities/search?apikey=" + apiKey + "&q=" + search;
  
  fetch(locationUrl)
    .then(response => response.json())
    .then(data => {
      document.querySelector(".card").style.display = "block";
      createLocationElement(data[0].EnglishName, data[0].AdministrativeArea.EnglishName);
      getForecast(data, data[0].Key);
    });
});


// Add click listener to all tabs
var tabs = document.getElementsByClassName("tab");
var card = document.querySelector(".card__content");
var airQuality = document.getElementById("AirQuality");
var uvIndex = document.getElementById("UVIndex");

Array.from(tabs).forEach(function(tab) {
  tab.addEventListener("click",function() {
    Array.from(tabs).forEach(function(tab) {
      tab.classList.remove("active");
    });
    this.classList.add("active");
    card.classList.remove("card__content--left");
    card.classList.remove("card__content--right");
    if(this.classList.contains("tab--right")) {
      card.classList.add("card__content--left");
      airQuality.style.display = "none";
      uvIndex.style.display = "flex";
    } else if(this.classList.contains("active")) {
      card.classList.add("card__content--right");
      uvIndex.style.display = "none";
      airQuality.style.display = "flex";
    }
  });
});


// Change border radius side of card content depending on which dtab is active
var tabRight = document.querySelector(".tab--right");
var tabLeft = document.querySelector(".tab--left");


// Add text blurb regarding conditions to top of card
function createAirMessage(pd, ad) {
  var airConditionElement = document.createElement('P');
  var airMessageElement = document.createElement('P');

  var airMessageContainer = document.createElement('DIV');
  airMessageContainer.classList.add("message__container");
  airMessageContainer.id = "AirMessageContainer";

  // Find the total of pollen levels and the average
  /*TURN THIS INTO ITS OWN FUNCTION*/
  var pollenAverage = 0;
  var pollenTotal = 0;
  for(var i = 1; i < pd.length; i++) {
    if(i != 2) {
      pollenTotal += pd[i].CategoryValue;
    }
    pollenAverage = Math.round(pollenTotal / 4);
  }

  var pollenString = "";
  if(pollenAverage == 1) {
    pollenString = "low";
  } else if(pollenAverage == 2) {
    pollenString = "moderate";
  } else if(pollenAverage == 3) {
    pollenString = "high";
  } else if(pollenAverage == 4) {
    pollenString = "very high";
  } else if(pollenAverage == 5) {
    pollenString = "extreme";
  } else if(pollenAverage == 6) {
    pollenString = "deathly";
  }

  var airConditionString = "The air quality is <span class='message-span' id='airmessage-span-" + ad.Category.toLowerCase() +  "'>" + ad.Category.toLowerCase() + "</span> and the pollen levels are <span class='message-span' id='pollenmessage-span-" + pollenAverage + "'>" + pollenString + "</span>.";
  var airMessageString = "";
  if(pollenTotal <= 3) {
    airMessageString = "Today's a great day. Go out and enjoy the fresh air!";
  } else if(pollenTotal <= 6) {
    airMessageString = "Today's a decent day. Enjoy the outdoors but take precautions if you're sensitive.";
  } else if(pollenTotal <= 9) {
    airMessageString = "Today's a meh day. You might need to take some allergy medicine if you plan to be outside.";
  } else if(pollenTotal <= 12) {
    airMessageString = "Today might be a bad day to go outside. Take some medicine and try to stay indoors if you can.";
  } else if(pollenTotal <= 15) {
    airMessageString = "Today's an extremely bad day for pollen. Taek some medicine and stay indoors as much as possible.";
  } else if(pollenTotal <= 18) {
    airMessageString = "Uh oh! If you're reading this, it's too late. It's raining pollen. Head in to your bunker and stay put until further advisory if you want to live.";
  }

  var airConditionNode = document.createTextNode(airConditionString);
  var airMessageNode = document.createTextNode(airMessageString);
  airMessageElement.appendChild(airMessageNode);
  airMessageElement.classList.add("card__message");
  // airConditionElement.appendChild(conditionNode);
  airConditionElement.classList.add("card__condition");
  // if(document.querySelector(".card__message") && document.querySelector(".card__message")) {
  //   document.querySelector(".card__message").parentNode.removeChild(document.querySelector(".card__message"));
  //   document.querySelector(".card__condition").parentNode.removeChild(document.querySelector(".card__condition"));
  // }
  airConditionElement.innerHTML = airConditionString;
  airMessageContainer.appendChild(airConditionElement);
  // airMessageContainer.appendChild(airMessageElement);
  if(document.getElementById('AirMessageContainer')) {
    while(document.getElementById('AirMessageContainer').firstChild) {
      document.getElementById('AirMessageContainer').removeChild(document.getElementById('AirMessageContainer').firstChild);
    }
  } else {
    document.getElementById('AirQuality').appendChild(airMessageContainer);
  }

  document.getElementById('AirMessageContainer').appendChild(airConditionElement);
  document.getElementById('AirMessageContainer').appendChild(airMessageElement);
}

//Create messages for uv conditions 
function createUVMessage(uvData) {
  var uvConditionElement = document.createElement('P');
  var uvMessageElement = document.createElement("P");

  var uvMessageContainer = document.createElement('DIV');
  uvMessageContainer.classList.add("message__container");
  uvMessageContainer.id = "UVMessageContainer";

  var uvString = "";

  //depending on the category value of the uv index, create a different message

  if(uvData.CategoryValue == 1) {
    uvString = "low";
  } else if(uvData.CategoryValue == 2) {
    uvString = "moderate";
  } else if(uvData.CategoryValue == 3) {
    uvString = "high";
  } else if(uvData.CategoryValue == 4) {
    uvString = "very high";
  } else if(uvData.CategoryValue == 5) {
    uvString = "extreme";
  } else if(uvData.CategoryValue == 6) {
    uvString = "deathly";
  }

  var uvConditionString = "The UV index is <span class='message-span' id='uvmessage-span-" + uvData.CategoryValue +  "'>" + uvData.Category.toUpperCase() + " </span>.";
  var uvMessageString = "";
  if(uvData.CategoryValue = 1) {
    uvMessageString = "Today's a great day. Go out and get some Vitamin D!";
  } else if(uvData.CategoryValue = 2) {
    uvMessageString = "Today's a decent day. Enjoy the outdoors, the sun shouldn't be too much of a problem.";
  } else if(uvData.CategoryValue =3) {
    uvMessageString = "Today's a meh day. You might want to consider putting on some sunscreen, at least on your sensitive body parts like your face and try to stay in the shade.";
  } else if(uvData.CategoryValue =4) {
    uvMessageString = "Today's UV index is going to be pretty rough. Apply suncreen, cover up your body, and stay in the shade as much as possible.";
  } else if(uvData.CategoryValue = 5) {
    uvMessageString = "Today's an extremely bad day for UV. You should be very cautious about going outdoors.";
  } else if(uvData.CategoryValue = 6) {
    uvMessageString = "Uh oh! If you're reading this, it's too late. The sun is exploding and raining UV onto earth. Seek shelter immediately!";
  }

  // var uvConditionNode = document.createTextNode(uvConditionString);
  var uvMessageNode = document.createTextNode(uvMessageString);
  uvMessageElement.appendChild(uvMessageNode);
  uvMessageElement.classList.add("card__message");
  uvConditionElement.innerHTML = uvConditionString;
  uvConditionElement.classList.add("card__condition");
  if(document.getElementById('UVMessageContainer')) {
    while(document.getElementById('UVMessageContainer').firstChild) {
      document.getElementById('UVMessageContainer').removeChild(document.getElementById('UVMessageContainer').firstChild);
    }
  } else {
    document.getElementById('UVIndex').appendChild(uvMessageContainer);
  }
  document.getElementById('UVMessageContainer').appendChild(uvConditionElement);
  document.getElementById('UVMessageContainer').appendChild(uvMessageElement);
  console.log('hello wolrd world world');
}


// Function that adds a text element under the form with the location name (City, State, Zip) after providing search query
function createLocationElement(city, state) {
  var locationElement = document.createElement("H2");
  var locationStr = city + ", " + state;

  var locationText = document.createTextNode(locationStr);
  locationElement.appendChild(locationText);
  locationElement.classList.add("location");

  console.log(locationStr);
  if(document.querySelector(".location")) {
    document.querySelector(".location").textContent = locationStr;
  } else {
    document.querySelector(".container").appendChild(locationElement);
  }
}