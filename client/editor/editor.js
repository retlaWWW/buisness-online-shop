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

function addNewGame(games) {
  const root = document.querySelector("#root");
  console.log(games);
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
