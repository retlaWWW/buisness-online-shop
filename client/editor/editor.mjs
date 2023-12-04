// editor.mjs

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
    console.log("Games data:", data);
    return data.games;
  } catch (error) {
    console.error("Error fetching games.json:", error);
  }
}

async function loadEditor() {
  const games = await fetchGames();
  addNewGame(games);
  editGame(games);
  deleteGame(games);
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
    event.preventDefault(); // Prevent default form submission behavior

    const formData = new FormData(document.getElementById("addGameForm"));
    const newGame = {};
    formData.forEach((value, key) => {
      newGame[key] = value;
    });

    const smallestUnusedID = await findSmallestUnusedID();
    newGame.id = smallestUnusedID;

    // Make a POST request to your server to add the new game to the JSON file
    const response = await fetch("/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGame),
    });

    if (response.ok) {
      alert("Game added successfully!");
    } else {
      alert("Failed to add the game. Please try again.");
    }
  });
}

async function findSmallestUnusedID() {
  const response = await fetch("/api/games");
  const data = await response.json();
  const existingIDs = data.games.map((game) => game.id);
  let id = 1;
  while (existingIDs.includes(id)) {
    id++;
  }
  return id;
}

function editGame(games) {
  const root = document.querySelector("#root");
  console.log(games);
}

function deleteGame(games) {
  const root = document.querySelector("#root");
  console.log(games);
}

function loadEvent() {
  checkPassword();
}

window.addEventListener("load", loadEvent);
