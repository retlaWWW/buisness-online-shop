let quan = [];
let asd = [];
let allIDs = [];

let orderNumber = 0;

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
          displayTotal();
        });
      } else if (button.innerText === "-") {
        button.addEventListener("click", () => {
          if (count > 1) {
            label.innerText = --count;
          }
          buttons[1].disabled = count >= pcs;
          button.disabled = count <= 1;
          displayTotal();
        });
      }
    });
  });
}

function checkout(games, basket) {
  const root = document.querySelector("#root");
  const order = document.querySelector('.main')
  const form = order.querySelector('#orderForm')
  form.insertAdjacentHTML(
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
    root.innerHTML = "";
    orderNumber++;
    root.insertAdjacentHTML("beforeend", 
    `
    <div class="buy">
    <h1>Thank you for your purchase!</h1>
    <h2>Your order number is: ${orderNumber}</h2>
    </div>
    `
    );

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
  const totalElement = document.querySelector(".totalnum");
  console.log("allids: ", allIDs);
  let i = 0;
  let total = 0;
  allIDs.forEach((id) => {
    quan.push(0);
    const current = document.querySelector(`.container${parseInt(id)}`);
    const cbq = current.querySelector(`.bq${parseInt(id)}`);
    quan[i] = parseInt(cbq.innerText);
    total = total + asd[i] * quan[i];
    i++;
  });
  console.log("price: ", asd);
  console.log("quan: ", quan);
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
        plusMinus(game.stock);
        allIDs.push(game.id);
        asd.push(game.price);
      }
    });
  });
}

function placeOrder() {
  const root = document.querySelector("#root");
  root.insertAdjacentHTML(
    "beforeend",
    `
    <div class="main">
    <form id="orderForm" action="/submit" method="post">
    <h2>Shipping details</h2>\n
    <br><label for="shippingName">Shipping Name:</label>
    <input class="order" type="text" id="shippingName" name="shippingName" required>\n
    <label for="shippingAddress">Shipping Address:</label>
    <input class="order" type="text" id="shippingAddress" name="shippingAddress" required>\n
    <label for="shippingCity">Shipping City:</label>
    <input class="order" type="text" id="shippingCity" name="shippingCity" required>\n
    <label for="shippingZip">Shipping ZIP Code:</label>
    <input class="order" type="text" id="shippingZip" name="shippingZip" required>\n
    <h2>Buyer Details</h2>\n
    <br>
    <label for="buyerName">Your Name:</label>
    <input class="order" type="text" id="buyerName" name="buyerName" required>\n
    <label for="buyerEmail">Your Email:</label>
    <input class="order" "type="email" id="buyerEmail" name="buyerEmail" required>\n
    <label for="buyerPhone">Your Phone:</label>
    <input class="order" type="tel" id="buyerPhone" name="buyerPhone" required>\n
  </form>

    </div>
    `
  );
}

async function loadEvent() {
  const games = await fetchGames();
  const basket = await fetchBasket();
  console.log("games: ", games);
  console.log("basket: ", basket);
  display(games, basket);
  placeOrder();
  checkout(games, basket);
  deleter(games, basket);
  
}

window.addEventListener("load", loadEvent);
