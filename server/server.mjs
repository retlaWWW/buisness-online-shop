import express from "express";
import fs from "fs/promises";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, "games.json");

const PORT = 4040;
const app = express();

app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

async function findSmallestUnusedID(gamesData) {
  try {
    if (!gamesData || !gamesData.games) {
      console.error("Invalid gamesData:", gamesData);
      return 1; 
    }
    const existingIDs = gamesData.games.map((game) => game.id);
    let id = 1;
    while (existingIDs.includes(id)) {
      id++;
    }
    return id;
  } catch (error) {
    console.error("Error in findSmallestUnusedID:", error);
    return 1;
  }
}

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:4040",
  })
);

const parseGames = async () => {
  try {
    const internGames = await fs.readFile(filePath);
    const games = JSON.parse(internGames).games;
    return { games };
  } catch (error) {
    console.error("Error parsing games.json:", error);
    return { games: [] };
  }
};

const getBasket = async () => {
  try {
    const internBasket = await fs.readFile(
      path.resolve(__dirname, "basket.json")
    );
    const basketData = JSON.parse(internBasket);
    const basket =
      basketData.basket && Array.isArray(basketData.basket)
        ? basketData.basket
        : [];
    console.log("Parsed basket:", basket);
    return { basket };
  } catch (error) {
    console.error("Error parsing basket.json:", error);
    return { basket: [] };
  }
};

app.get("/api/basket", async (req, res) => {
  const basket = await getBasket();
  res.json({ basket });
});

app.get("/api/games", async (req, res) => {
  const games = await parseGames();
  res.json({ games });
});

app.post("/api/basket", async (req, res) => {
  try {
    const { itemId } = req.body;
    console.log("Received request to add item to basket. Item ID:", itemId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const basketData = await getBasket();
    console.log("Current basket data:", basketData);
    if (!basketData.basket || !Array.isArray(basketData.basket)) {
      basketData.basket = [];
    }
    basketData.basket.push({ id: itemId });
    console.log("Updated basket data:", basketData);
    const bp = path.resolve(__dirname, "basket.json");
    await fs.writeFile(bp, JSON.stringify(basketData, null, 2));
    console.log("Basket data successfully written to file.");
    res.json({ message: "Item added to basket successfully" });
  } catch (error) {
    console.error("Error adding item to basket:", error);
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        details: error.message,
        stack: error.stack,
      });
  }
});

app.post("/api/basket/clear", async (req, res) => {
  try {
    console.log("Received request to clear the basket.");
    const bp = path.resolve(__dirname, "basket.json");
    await fs.writeFile(bp, JSON.stringify({ basket: [] }, null, 2));
    console.log("Basket cleared successfully.");
    res.json({ message: "Basket cleared successfully" });
  } catch (error) {
    console.error("Error clearing the basket:", error);
    res
      .status(500)
      .json({
        error: "Internal Server Error",
        details: error.message,
        stack: error.stack,
      });
  }
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/products/products.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/editor/editor.html"));
});

app.post("/admin", async (req, res) => {
  try {
    const newGame = req.body;
    const gamesData = await parseGames();
    const smallestUnusedID = await findSmallestUnusedID(gamesData);
    newGame.id = smallestUnusedID;
    gamesData.games.push(newGame);
    await fs.writeFile(filePath, JSON.stringify(gamesData, null, 2));
    res.json({ message: "Game added successfully", game: newGame });
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/admin/:id", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const gamesData = await parseGames();
    const gamesArray = gamesData.games;
    const editedGame = await req.body;
    const newGamesArray = [];

    gamesArray.forEach((game) => {
      game.id === editedGame.id
        ? newGamesArray.push(editedGame)
        : newGamesArray.push(game);
    });
    await fs.writeFile(
      filePath,
      JSON.stringify({ games: newGamesArray }, null, 2)
    );
    res.json({ message: "Game updated succesfully: ", editedGame });
  } catch (error) {
    console.error("Error editing game : ", error);
    res.status(500).json({ error: "internal server error" });
  }
});

app.delete("/admin/:id", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    const gamesData = await parseGames();
    const gameIndex = gamesData.games.findIndex((game) => game.id === gameId);
    if (gameIndex === -1) {
      return res.status(404).json({ error: "Game not found" });
    }
    const deletedGame = gamesData.games.splice(gameIndex, 1)[0];
    await fs.writeFile(filePath, JSON.stringify(gamesData, null, 2));
    res.json({ message: "Game deleted successfully", deletedGame });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/basket", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/basket/basket.html"));
});

app.post("/basket", (req, res) => {
  res.send("post");

});

app.get("/basket", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/basket/basket.html"));
});


app.get('/basket', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/basket/basket.html'));
})


app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
})
