const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchForm = document.getElementById("search-form");

const pokemonNameElem = document.getElementById("pokemon-name");
const pokemonIdElem = document.getElementById("pokemon-id");
const pokemonWeightElem = document.getElementById("weight");

const pokemonHeightElem = document.getElementById("height");
const pokemonTypesElem = document.getElementById("types");

const formattedStats = {};
let currentPokemonName;
let previousPokemonName;

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


const formattedStatsKeys = () => Object.keys(formattedStats);

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
}

const searchForPokemon = async () => {
  const inputValue = searchInput.value;
  console.log(inputValue);
  const formattedInput = formatInput(inputValue);
  const pokemonResult = await fetchPokemon(formattedInput);
  if (pokemonResult) {
    updatePokemonCard(pokemonResult);
  }
}

const formatInput = (input) => {
  const regex = /[\da-z\s]/gi;
  const match = input.match(regex);
  if (!match) {
    alert("Pokémon not found");
    return;
  }
  const formattedString = match.join("").toLowerCase().replace(/\s/g, "-");
  console.log(`formatted string: ${formattedString}`)
  return formattedString;
}

const displayComparisonStats = () => {

}



searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchForPokemon();
})
