const basket = [];

async function displayCurrentGames() {
  const response = await fetch("/api/games");
  const data = await response.json();
  const games = data.games.games;
  console.log(games);

  const root = document.querySelector("#root");
  games.forEach((game) => {
    let current = `${game.price}$`;
    if (game.price === 0) {
      current = 'FREE';
    }
    root.insertAdjacentHTML(
      "beforeend",
      `
      <div class="container container${game.id}">
      <h2>${game.name}<h3>${current}</h3></h2>
      <div class="details">
      <p>${game.description}</p>
      <p class="year">${game.year}</p>
      <p>Stock: ${game.stock} pcs</p>  
      </div>
      <button class="action-button" data-game-id="${game.id}">Add product</button>   
        `
    );
  });
  const buttonElements = document.querySelectorAll(".action-button");
  buttonElements.forEach((button) => {
    button.addEventListener("click", (event) => {
      const gameId = event.target.dataset.gameId;
      addToBasket(gameId);
      console.log(basket)
    });
  });
}

function addToBasket(gameId) {
    if (!basket.includes(gameId)) {
        basket.push(gameId)
    }
}

document.addEventListener("DOMContentLoaded", async () => {
  await displayCurrentGames();
  
});
