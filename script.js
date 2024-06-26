
// get all the interactive elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchForm = document.getElementById("search-form");

// select all the information element, where data will be updated.
const pokemonNameElem = document.getElementById("pokemon-name");
const pokemonIdElem = document.getElementById("pokemon-id");
const pokemonWeightElem = document.getElementById("weight");
const pokemonHeightElem = document.getElementById("height");
const pokemonTypesElem = document.getElementById("types");


// keep track of the previous stats, current pokemon name and previous pokemon name.
const formattedStats = {};
let currentPokemonName;
let previousPokemonName;

// function to fetch pokemon, using a specific input - can either be an id of a name.
const fetchPokemon = async (formattedInput) => {
  const url = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon"
  try {
    const result = await fetch(`${url}/${formattedInput}`);
    const data = await result.json();
    return data;
  } catch (e) {
    console.info(`Error fetching pokemon: ${e}`)
    alert("Pokémon not found")
    return 0;
  }
}

// utiliity funciton to get the stats keys - found myself using this a few times.
const formattedStatsKeys = () => Object.keys(formattedStats);

// function to append additional columns to the table, when user searched more than once.
const appendAdditionalColumns = (parent) => {
  const parentChildren = [...parent.children];
  let comparisonColNameElem;
  let winnerColNameElem;
  if (parentChildren.length === 2) {
    comparisonColNameElem = document.createElement("th");
    winnerColNameElem = document.createElement("th");
    parent.appendChild(comparisonColNameElem);
    parent.appendChild(winnerColNameElem);
  } else {
    comparisonColNameElem = parentChildren[2];
    winnerColNameElem = parentChildren[3];
  }

  comparisonColNameElem.textContent = `${previousPokemonName}'s Stats`
  winnerColNameElem.textContent = `Stat Winner`
}

// function to display the winner for each stat, by setting either a draw, or the name of the pokemon.
const displayStatsWinner = () => {
  const tbodyRows = [...document.querySelectorAll("tbody tr")];
  // turn the tbodyRows to be an array of arrays, each array consisting of td elements. Each array represents one tr in the body.
  const rowsArrayWithChildren = tbodyRows.map(row => [...row.children]);
  rowsArrayWithChildren.forEach(row => {
    console.log(`Rows TextContent Array: ${row.map(td => td.textContent)}`)
    const currentStat = Number(row[1].textContent);
    const previousStat = Number(row[2].textContent);
    const setWinner = (text) => {
      row[3].textContent = text;
    }
    setWinner(currentStat === previousStat ? "DRAW" : currentStat > previousStat ? currentPokemonName : previousPokemonName);
  })
}

// funciton to display the previous pokemon stats, next to the current pokemon stats
const displayPreviousPokemonStats = (formattedStatsKeysArr) => {
  const thead = document.querySelector("thead tr");

  const tbodyRows = Array.from(document.querySelectorAll("tbody tr"));
  const hasPreviousStats = tbodyRows.every(row => Array.from(row.children).length >= 3);
  if (formattedStatsKeysArr.length) {
    if (hasPreviousStats) {
      tbodyRows.forEach((row, index) => {
        const rowChildren = [...row.children];
        rowChildren[2].textContent = formattedStats[formattedStatsKeysArr[index]];
      })
    } else {
      for (let i = 0; i < formattedStatsKeysArr.length; i++) {
        const key = formattedStatsKeysArr[i];
        const previousStatElem = document.createElement("td");
        const winnerStatElem = document.createElement("td");
        previousStatElem.textContent = formattedStats[key];
        tbodyRows[i].appendChild(previousStatElem);
        tbodyRows[i].appendChild(winnerStatElem);
        tbodyRows[i].appendChild(winnerStatElem);
      }
    }
    appendAdditionalColumns(thead);
  }
}

// function that takes the fetched data, and display the data on the web page. It uses the functions above as well.
const updatePokemonCard = ({ types, weight, height, id, name, stats, sprites }) => {
  previousPokemonName = currentPokemonName;
  currentPokemonName = name.toUpperCase();
  pokemonNameElem.textContent = currentPokemonName;
  pokemonIdElem.textContent = `#${id}`;
  pokemonWeightElem.textContent = weight;
  pokemonHeightElem.textContent = height;
  const formattedStatsKeysArr = formattedStatsKeys();
  displayPreviousPokemonStats(formattedStatsKeysArr)

  for (const stat of stats) {
    const statKey = stat["stat"]["name"];
    formattedStats[statKey] = stat["base_stat"];
    const tdElem = document.getElementById(statKey);
    if (tdElem) {
      tdElem.textContent = formattedStats[statKey];
    }
  }

  if (formattedStatsKeysArr.length) {
    displayStatsWinner();
  }
  const img = document.querySelector("img");
  img.src = sprites["front_default"];

  pokemonTypesElem.innerHTML = types.map(({ type }) => {
    return `<p class="type ${type.name}">${type.name.toUpperCase()}</p>`
  }).join("");
  const randomColors = ["red", "green", "orange", "purple", "blue", "brown"]
  const getRandomIndex = () => Math.floor(Math.random() * randomColors.length);
  const getRandomColor = () => randomColors[getRandomIndex()];
  const typesChildren = Array.from(pokemonTypesElem.children);
  console.log(`Types Children length: ${typesChildren.length}`)
  typesChildren.forEach(child => child.style.backgroundColor = getRandomColor())
}

// search function that is called when the search button is clicked
const searchForPokemon = async () => {
  const inputValue = searchInput.value;
  console.log(inputValue);
  const formattedInput = formatInput(inputValue);
  const pokemonResult = await fetchPokemon(formattedInput);
  if (pokemonResult) {
    updatePokemonCard(pokemonResult);
  }
}

// format the input, to only match numbers, spaces and alphabet characters
const formatInput = (input) => {
  const regex = /[\da-z\s]/gi;
  const match = input.match(regex);
  if (!match) {
    alert("Pokémon not found");
    return;
  }
  // replace spaces with "-", as the API expects words to be separated by spaces.
  const formattedString = match.join("").toLowerCase().replace(/\s/g, "-");
  console.log(`formatted string: ${formattedString}`)
  return formattedString;
}

// add event listenet to the form, of type submit. 
searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page refresh.
  searchForPokemon();
})
