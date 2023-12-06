
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
      throw new Error("Network response was not ok")
    }
    const data = await response.json();
    return data.basket;
  } catch (error) {
    console.error("Error fetching basket.json: ", error)
  }
}

function plusMinus() {
  const allContainers = document.querySelectorAll('.container')
  allContainers.forEach((container) => {
    const q = container.querySelector('.quantity')
    console.log(q);
    const buttons = q.querySelectorAll('button');
    const label = q.querySelector('label');
    console.log(buttons, label)
    let i = 1;
    for (let i = 0; i < buttons.length; i++) {
      console.log(buttons[i])
    }
    // plus.addEventListener('click', () => {
    //   label.innerText = i++;
    //   i++;
    // })
    // minus.addEventListener('click', () => {
    //   if (i > 0) {
    //     label.innerText = i--;
    //     i--;
    //   } else {
    //     label.innerText = 0;
    //   }
    // })
  })
}

function display(games, basket) {
  const root = document.querySelector('#root');
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
            <button class"minus">-</button>
            <label class="bq">1</label>
            <button class"plus">+</button>
          </div>
        </div>
        `
      );
      }
    })
  });
  plusMinus();
}

async function loadEvent() {
  const games = await fetchGames();
  const basket = await fetchBasket();
  console.log('games: ', games);
  console.log('basket: ', basket)
  display(games, basket)
}

window.addEventListener("load", loadEvent);
