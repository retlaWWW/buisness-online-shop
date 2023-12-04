const basket = [];

async function displayCurrentGames() {
  const response = await fetch("/api/games");
  const data = await response.json();
  const games = data.games;
  console.log(games);

  const root = document.querySelector("#root");
  games.forEach((game) => {
    root.insertAdjacentHTML(
      "beforeend",
      `
      <div class="container">
      <h2>${game.name}</h2>
      <p>
      Description: ${game.description} <br>
      ID: ${game.id} <br>
      Year: ${game.year}  <br>
      Stock: ${game.stock} pcs <br>
      <h3>Price: ${game.price}$  </h3><br>
      </p>
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
