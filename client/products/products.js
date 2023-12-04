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
        <h2>Current Games:</h2>
        <p>
        ID: ${game.id} 
        Name: ${game.name} 
        Year: ${game.year} 
        Price: ${game.price}$ 
        Description: ${game.description}
        Stock: ${game.stock} pcs
        </p>
        <button class="action-button" data-game-id="${game.id}">Add product</button>        
        </div>
        `
    );
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await displayCurrentGames();
});
