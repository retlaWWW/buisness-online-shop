const basket = [];

async function displayCurrentGames() {
  try {
    const response = await fetch("/api/games");
    const data = await response.json();
    const games = data.games.games;
    console.log('Games:', games);

    const root = document.querySelector("#root");
    games.forEach((game) => {
      let current = `${game.price}$`;
      if (game.price === 0) {
        current = "FREE";
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
      button.addEventListener("click", async (event) => {
        const gameId = event.target.dataset.gameId;
        await addToBasket(gameId);
        console.log('Basket:', basket);
      });
    });
  } catch (error) {
    console.error('Error fetching or displaying games:', error);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await fetch("http://localhost:4040/api/basket/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Basket cleared successfully");
      } else {
        console.error("Failed to clear the basket");
      }
    } catch (error) {
      console.error("Error clearing the basket:", error);
    }
    await displayCurrentGames();
  });
}

async function addToBasket(gameId) {
  try {
    if (!basket.includes(gameId)) {
      basket.push(gameId);
      await addItemToBasket(gameId);
    }
  } catch (error) {
    console.error('Error adding item to basket:', error);
  }
}

async function addItemToBasket(itemId) {
  try {
    const response = await fetch("http://localhost:4040/api/basket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    });
    if (response.ok) {
      console.log("Item added to basket successfully");
    } else {
      console.error("Failed to add item to basket");
    }
  } catch (error) {
    console.error("Error adding item to basket:", error);
  }
}
