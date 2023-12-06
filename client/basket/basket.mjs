const prices = [];
const quan = [];

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
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.basket;
  } catch (error) {
    console.error("Error fetching basket.json: ", error);
  }
}

function plusMinus(pcs) {
  const allContainers = document.querySelectorAll(".container");
  allContainers.forEach((container) => {
    const q = container.querySelector(".quantity");
    const buttons = q.querySelectorAll("button");
    const label = q.querySelector("label");
    let count = 1;
    buttons.forEach((button) => {
      if (button.innerText === "+") {
        button.addEventListener("click", () => {
          if (count < pcs) {
            label.innerText = ++count;
          }
          if (count === pcs) {
            button.disabled = true;
          }
          buttons[0].disabled = count <= 1;
        });
      } else if (button.innerText === "-") {
        button.addEventListener("click", () => {
          if (count > 1) {
            label.innerText = --count;
          }
          buttons[1].disabled = count >= pcs;          
          button.disabled = count <= 1;
        });
      }
    });
  });
}

function checkout() {
  const root = document.querySelector('#root');
  root.insertAdjacentHTML('beforeend', `<div class="checkout"><button id="check">Checkout</button></div>`)
  const checkBtn = document.querySelector('#check');
}

function display(games, basket) {
  const root = document.querySelector("#root");
  games.games.forEach((game) => {
    basket.basket.forEach((bId) => {
      let number = parseInt(bId.id);
      if (number === game.id) {
        let current = `${game.price}$`;
        if (game.price === 0) {
          current = "FREE";
        }
        root.insertAdjacentHTML(
          "beforeend",
          `
        <div class="container container${game.id}">
          <div><h2>${game.name}</h2>
            <h3>
              ${current}
            </h3>
          </div>
          <p>
            Stock: ${game.stock} pcs
          </p>  
          <div class="quantity">
            <button class="minus">-</button>
            <label class="bq">1</label>
            <button class="plus">+</button>
          </div>
        </div>
        `
        );
        plusMinus(game.stock);
      }
    });
  });
  
}

async function loadEvent() {
  const games = await fetchGames();
  const basket = await fetchBasket();
  console.log("games: ", games);
  console.log("basket: ", basket);
  display(games, basket);
  checkout();
}

window.addEventListener("load", loadEvent);
