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
        <h3>${game.year}</h3>
        <h3>${game.price}$</h3> 
        <h4>${game.description}</p></h4>
        </div>
        `
    );
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await displayCurrentGames();
});
