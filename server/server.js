import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 4040;
const app = express();

app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

const parseGames = async () => {
  const internGames = await fs.readFile("games.json");
  const games = JSON.parse(internGames).games;
  return games;
}

app.get("/api/games", async (req, res) => {
  const games = await parseGames();
  res.json( { games } )
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/products/products.html'));
})

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/editor/editor.html'));
})

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/editor/editor.html'));
});

app.post('/admin', async (req, res) => {
  try {
    const newGame = req.body;
    // Fetch existing games data
    const gamesData = await parseGames();
    // Find the smallest unused ID
    const smallestUnusedID = findSmallestUnusedID(gamesData);
    // Assign the new ID
    newGame.id = smallestUnusedID;
    // Add the new game to the data
    console.log('added:' + newGame);
    gamesData.games.push(newGame);
    // Write the updated data back to the file
    await fs.writeFile("games.json", JSON.stringify(gamesData, null, 2));
    res.json({ message: 'Game added successfully', game: newGame });
  } catch (error) {
    console.error("Error adding game:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  

app.get('/basket', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/basket/basket.html'));
})

app.post('/basket', (req, res) => {
  res.send('post');
})

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
