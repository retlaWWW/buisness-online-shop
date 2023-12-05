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
      <div class="container">
      <h2>${game.name}</h2>
      <div class="details">
      ${game.description} <br>
      ${game.id} <br>
      ${game.year}  <br>
      Stock: ${game.stock} pcs <br>
      <h3>Price: ${current}  </h3><br>    
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
