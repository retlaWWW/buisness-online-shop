async function fetchGames() {
  try {
    const response = await fetch("/api/games");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Games data:", data);
    return data.games;
  } catch (error) {
    console.error("Error fetching games.json:", error);
  }
}

function checkCartClickForm() {
  document.querySelector("#cartButton");
}

async function loadEvent() {
  const games = await fetchGames();
  console.log(games);
}

window.addEventListener("load", loadEvent);
