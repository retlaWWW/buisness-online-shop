
async function fetchGames() {
  try {
    const response = await fetch("/api/games");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.games;
  } catch (error) {
    console.error("Error fetching games.json:", error);
  }
}

async function fetchBasket() {
  try {
    const response = await fetch("/api/basket");
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json();
    return data.basket;
  } catch (error) {
    console.error("Error fetching basket.json: ", error)
  }
}

async function loadEvent() {
  const games = await fetchGames();
  const basket = await fetchBasket();
  console.log('games: ', games);
  console.log('basket: ', basket)
}

window.addEventListener("load", loadEvent);
