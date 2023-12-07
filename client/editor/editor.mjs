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
  const root = document.querySelector("#root");
  root.insertAdjacentHTML(
    "beforeend",
    `
    <h2>Add New Video Game</h2>
    <form id="addGameForm">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required>
      <label for="year">Year:</label>
      <input type="number" id="year" name="year" required>
      <label for="price">Price:</label>
      <input type="number" id="price" name="price" required>
      <label for="description">Description:</label>
      <textarea id="description" name="description" required></textarea>
      <label for="stock">Stock:</label>
      <input type="number" id="stock" name="stock" required>
      <button class="add">Add Game</button>
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
    // const smallestUnusedID = await findSmallestUnusedID();
    // newGame.id = smallestUnusedID;
    const response = await fetch("/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGame),
    });

    if (response.ok) {
      alert("Game added successfully!");
      // Reload the page after successful add
      window.location.reload();
    } else {
      alert("Failed to add the game. Please try again.");
    }
  });
}

// async function findSmallestUnusedID() {
//   try {
//     const response = await fetch("/api/games");
//     const data = await response.json();
//     if (!Array.isArray(data.games.games)) {
//       console.error("Invalid data format. 'games' is not an array:", data);
//       return 1;
//     }
//     return data.games.games;
//   } catch (error) {
//     console.error("Error fetching games.json:", error);
//     return 1;
//   }
// }

function editGame(games) {
  const editGame = document.querySelector("#edit");
  editGame.insertAdjacentHTML(
    "beforeend",
    `
    <h2>Edit Video Game</h2>
    <form id="editGameForm">
      <label for="gameToEdit">Game to Edit:</label>
      <select id="gameToEdit" name="gameToEdit" required>
        <option value="" disabled selected hidden>Choose a game</option>
        ${games
          .map((game) => `<option value="${game.id}">${game.name}</option>`)
          .join("")}
      </select>
      <div id="currentStock">Current Stock in Database: N/A</div>
      <label for="editedQuantity">Edited Stock:</label>
      <input type="number" id="editedQuantity" name="editedQuantity" required>
      <div id="currentPrice">Current Price in Database: N/A</div>
      <label for="editedPrice">Edited Price:</label>
      <input type="number" id="editedPrice" name="editedPrice" required>
      <button class="edit">Edit Game</button>
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
    // console.log(event)
    const formData = new FormData(document.getElementById("editGameForm"));
    const gameId = parseInt(formData.get("gameToEdit"));
    console.log("gameId: ", gameId);
    const editedQuantity = parseInt(formData.get("editedQuantity"));
    const editedPrice = parseInt(formData.get("editedPrice"));
    // let respData;
    // games.forEach((game) => {if (game.id === gameId) {respData = 1}})
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
      // Reload the page after successful deletion
      window.location.reload();
    } else {
      alert("Failed to edit the game. Please try again.");
    }
  });
}

function deleteGame(games) {
  const deleteGame = document.querySelector("#delete");
  console.log("delete part run");
  // Create a form for deleting games
  deleteGame.insertAdjacentHTML(
    "beforeend",
    `
    <h2>Delete Video Game</h2>
    <form id="deleteGameForm">
      <label for="gameToDelete">Game to Delete:</label>
      <select id="gameToDelete" name="gameToDelete" required>
        <option value="" disabled selected hidden>Choose a game</option>
        ${games
          .map((game) => `<option value="${game.id}">${game.name}</option>`)
          .join("")}
      </select>
      <button class="delete">Delete Game</button>
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
      // Reload the page after successful deletion
      window.location.reload();
    } else {
      alert("Failed to delete the game. Please try again.");
    }
  });
}

function loadEvent() {
  // checkPassword();
  loadEditor();
}

window.addEventListener("load", loadEvent);
