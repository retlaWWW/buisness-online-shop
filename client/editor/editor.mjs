function checkPassword() {
  const root = document.querySelector("#root");
  root.insertAdjacentHTML(
    "beforeend",
    `
    <label for="password">Password:</label>
    <input type="password" 
    id="password"
    name="password" 
    placeholder="Enter your password">
    <button class="btn">Login</button>`
  );
  const button = document.querySelector(".btn");
  button.addEventListener("click", function () {
    login();
  });
}

function login() {
  const passwordInput = document.querySelector("#password");
  const enteredPassword = passwordInput.value;
  if (enteredPassword === "asd123") {
    alert("Login successful!");
    const root = document.querySelector("#root");
    root.innerHTML = "";
    loadEditor();
  } else {
    alert("Incorrect password. Please try again.");
  }
}

async function fetchGames() {
  try {
    const response = await fetch("/api/games");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // console.log("Games data:", data);
    return data.games;
  } catch (error) {
    console.error("Error fetching games.json:", error);
  }
}

async function loadEditor() {
  const games = await fetchGames();
  addNewGame(games);
  editGame(games.games);
  deleteGame(games.games);
}

async function addNewGame(games) {
  const add = document.querySelector("#add");
  add.insertAdjacentHTML(
    "beforeend",
    `
    <h2>Add New Video Game</h2>
    <form id="addGameForm">
      <label for="name">Name:</label><br>
      <input type="text" id="name" class="addBox" name="name" required><br>
      <label for="year">Year:</label><br>
      <input type="number" id="year" class="addBox" name="year" required><br>
      <label for="price">Price:</label><br>
      <input type="number" id="price" class="addBox" name="price" required><br>
      <label for="description">Description:</label><br>
      <textarea id="description" class="addBox" name="description" required></textarea><br>
      <label for="stock">Stock:</label><br>
      <input type="number" id="stock" class="addBox" name="stock" required>
      <button class="add editButton">Add Game</button>
    </form>`
  );

  const addBtn = document.querySelector(".add");
  addBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("addGameForm"));
    const newGame = {};
    formData.forEach((value, key) => {
      newGame[key] = value;
    });
    const response = await fetch("/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGame),
    });

    if (response.ok) {
      alert("Game added successfully!");
      window.location.reload();
    } else {
      alert("Failed to add the game. Please try again.");
    }
  });
}

function editGame(games) {
  const editGame = document.querySelector("#edit");
  editGame.insertAdjacentHTML(
    "beforeend",
    `
    <h2>Edit Video Game</h2>
    <form id="editGameForm">
      <label for="gameToEdit">Game to Edit:</label>
      <select id="gameToEdit" name="gameToEdit" class="addBox" required>
        <option value="" disabled selected hidden>Choose a game</option>
        ${games
          .map((game) => `<option value="${game.id}">${game.name}</option>`)
          .join("")}
      </select><br>
      <div id="currentStock">Current Stock in Database: N/A</div>
      <label for="editedQuantity">Edited Stock:</label>
      <input type="number" id="editedQuantity" class="addBox" name="editedQuantity" required>
      <div id="currentPrice">Current Price in Database: N/A</div>
      <label for="editedPrice">Edited Price:</label>
      <input type="number" id="editedPrice" class="addBox" name="editedPrice" required>
      <button class="edit editButton">Edit Game</button>
    </form>
    `
  );
  const gameToEditSelect = document.querySelector("#gameToEdit");
  const currentStockDiv = document.querySelector("#currentStock");
  const currentPriceDiv = document.querySelector("#currentPrice");

  gameToEditSelect.addEventListener("change", function () {
    const selectedGameId = gameToEditSelect.value;
    const selectedGame = games.find(
      (game) => game.id === parseInt(selectedGameId)
    );

    if (selectedGame) {
      currentStockDiv.textContent = `Current Stock: ${selectedGame.stock} pieces`;
      currentPriceDiv.textContent = `Current Price: ${selectedGame.price} $`;
    } else {
      currentStockDiv.textContent = "Current Stock: N/A";
      currentPriceDiv.textcontent = "Current Price: N/A";
    }
  });

  const editBtn = document.querySelector(".edit");
  editBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("editGameForm"));
    const gameId = parseInt(formData.get("gameToEdit"));
    console.log("gameId: ", gameId);
    const editedQuantity = parseInt(formData.get("editedQuantity"));
    const editedPrice = parseInt(formData.get("editedPrice"));
    const respData = games.find((game) => {
      return game.id === gameId;
    });
    respData.stock = editedQuantity;
    respData.price = editedPrice;
    console.log(respData);
    const response = await fetch(`/admin/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(respData),
    });

    if (response.ok) {
      alert(`Edited game successfully!`);
      window.location.reload();
    } else {
      alert("Failed to edit the game. Please try again.");
    }
  });
}

function deleteGame(games) {
  const deleteGame = document.querySelector("#delete");
  console.log("delete part run");
  deleteGame.insertAdjacentHTML(
    "beforeend",
    `
    <h2>Delete Video Game</h2>
    <form id="deleteGameForm">
      <label for="gameToDelete">Game to Delete:</label>
      <select id="gameToDelete" class="addBox" name="gameToDelete" required>
        <option value="" disabled selected hidden>Choose a game</option>
        ${games
          .map((game) => `<option value="${game.id}">${game.name}</option>`)
          .join("")}
      </select>
      <button class="delete editButton">Delete Game</button>
    </form>
    `
  );

  const gameToDeleteSelect = document.querySelector("#gameToDelete");
  const currentStockDiv = document.querySelector("#currentStock");

  gameToDeleteSelect.addEventListener("change", function () {
    const selectedGameId = gameToDeleteSelect.value;
    const selectedGame = games.find(
      (game) => game.id === parseInt(selectedGameId)
    );
  });

  const deleteBtn = document.querySelector(".delete");
  deleteBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("deleteGameForm"));
    const gameId = formData.get("gameToDelete");
    const deleteQuantity = formData.get("deleteQuantity");

    const response = await fetch(`/admin/${gameId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert(`Deleted game successfully!`);
      window.location.reload();
    } else {
      alert("Failed to delete the game. Please try again.");
    }
  });
}

function loadEvent() {
  loadEditor();
}

window.addEventListener("load", loadEvent);
