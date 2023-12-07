let quan = [0,0,0,0];
let asd = [];
let allIDs = [];

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
          displayTotal()
        });
      } else if (button.innerText === "-") {
        button.addEventListener("click", () => {
          if (count > 1) {
            label.innerText = --count;
          }
          buttons[1].disabled = count >= pcs;
          button.disabled = count <= 1;
          displayTotal()
        });
      }
    });
  });
}

function checkout(games, basket) {
  const root = document.querySelector("#root");
  root.insertAdjacentHTML(
    "beforeend",
    `
    <div class="totaldiv">
    <label class="total">Total:</label>
    <span class="totalnum"></span>$
    </div>
    <div class="checkout">
    <button id="check">Purchase</button>
    </div>
    
    `
  );
  const checkBtn = document.querySelector("#check");
  checkBtn.addEventListener("click", () => {
    const allContainers = document.querySelectorAll(".container");
    allContainers.forEach((container) => {
      const quantity = container.querySelector(".quantity");
    });
    root.innerHTML = "";
    root.insertAdjacentHTML("");
  });
}

function deleter(games, basket) {
  const allContainers = [];
  basket.basket.forEach((id) => {
    const current = document.querySelector(`.container${id.id}`);
    allContainers.push(current);
  });
  console.log(allContainers);
  allContainers.forEach((container) => {
    const button = container.querySelector(".del");
    button.addEventListener("click", () => {
      container.remove();
    });
  });
}

function displayTotal() {
  const totalElement = document.querySelector('.totalnum');
  console.log('allids: ', allIDs);
  let i = 0;
  let total = 0;
  allIDs.forEach((id) => {
    const current = document.querySelector(`.container${parseInt(id)}`);
    const cbq = current.querySelector(`.bq${parseInt(id)}`);
    quan[i] = parseInt(cbq.innerText)
    total = total + (asd[i] * quan[i]);
    i++;
  })
  console.log('price: ', asd)
  console.log('quan: ',quan);
  totalElement.innerText = total;
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
            <label class="bq bq${game.id}">1</label>
            <button class="plus">+</button>
          </div>
          <button class="del">Delete</button>
        </div>
        `
        );
        const con = document.querySelector(`.container${game.id}`)
        plusMinus(game.stock);
        allIDs.push(game.id);
        asd.push(game.price);
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
  checkout(games, basket);
  deleter(games, basket);
}

window.addEventListener("load", loadEvent);
