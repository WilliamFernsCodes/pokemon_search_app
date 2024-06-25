const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchForm = document.getElementById("search-form");

const pokemonNameElem = document.getElementById("pokemon-name");
const pokemonIdElem = document.getElementById("pokemon-id");
const pokemonWeightElem = document.getElementById("weight");

const pokemonHeightElem = document.getElementById("height");
const pokemonTypesElem = document.getElementById("types");

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

const updatePokemonCard = ({ types, weight, height, id, name, stats, sprites }) => {
  pokemonNameElem.textContent = name.toUpperCase();
  pokemonIdElem.textContent = `#${id}`;
  pokemonWeightElem.textContent = weight;
  pokemonHeightElem.textContent = height;

  const formattedStats = {};

  for (const stat of stats) {
    const statKey = stat["stat"]["name"];
    formattedStats[statKey] = stat["base_stat"];
  }

  Object.keys(formattedStats).forEach(key => {
    const tdElem = document.getElementById(key);
    if (tdElem) {
      tdElem.textContent = formattedStats[key];
    }
  })
  const img = document.querySelector("img");
  img.src = sprites["front_default"];

  pokemonTypesElem.innerHTML = types.map(({type}) => {
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



searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  searchForPokemon();
})
