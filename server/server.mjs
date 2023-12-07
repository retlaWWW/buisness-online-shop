import express from "express";
import fs from "fs/promises";
import path from "path";
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
      return 1; // Assuming the smallest ID is 1 in case of an issue
    }

    const existingIDs = gamesData.games.map((game) => game.id);
    let id = 1;
    while (existingIDs.includes(id)) {
      id++;
    }
    return id;
  } catch (error) {
    console.error("Error in findSmallestUnusedID:", error);
    return 1; // Assuming the smallest ID is 1 in case of an error
  }
}

const parseGames = async () => {
  try {
    const internGames = await fs.readFile(filePath);
    const games = JSON.parse(internGames).games;
    // console.log('Parsed gamesData:', games);
    return { games };
  } catch (error) {
    console.error("Error parsing games.json:", error);
    return { games: [] };
  }
};

app.get("/api/games", async (req, res) => {
  const games = await parseGames();
  res.json({ games });
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
    // Fetch existing games data
    const gamesData = await parseGames();
    // Find the smallest unused ID needs await in order to get the data
    const smallestUnusedID = await findSmallestUnusedID(gamesData);
    // Assign the new ID
    newGame.id = smallestUnusedID;
    // Add the new game to the data
    console.log("added:" + newGame);
    gamesData.games.push(newGame);
    // Write the updated data back to the file
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

    // write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(newGamesArray, null, 2));

    res.json({ message: "Game updated succesfully: ", editedGame });

    // gamesArray.forEach(game => {if (game.id === editedGame.id) {
    //   newGamesArray = [...game]
    //   game = editedGame
    // }
    // });

    // for (const game of gamesArray) {
    //   if (game.id === editedGame.id) {
    //     game = editedGame
    //     console.log("game has been changed to", game)
    //     break
    //   } else {
    //     console.log("game hasn't been changed, needs to be corrected")
    //   }
    // }

    // console.log(newGamesArray);
    // res.send(newGamesArray);
    // const newGamesArray = gamesArray

    // Overwrite the game in the array
  } catch (error) {
    console.error("Error editing game : ", error);
    res.status(500).json({ error: "internal server error" });
  }
});

app.delete("/admin/:id", async (req, res) => {
  try {
    const gameId = parseInt(req.params.id);
    // Fetch existing games data
    const gamesData = await parseGames();
    // Find the index of the game with the specified ID
    const gameIndex = gamesData.games.findIndex((game) => game.id === gameId);

    if (gameIndex === -1) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Remove the game from the array
    const deletedGame = gamesData.games.splice(gameIndex, 1)[0];

    // Write the updated data back to the file
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

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
