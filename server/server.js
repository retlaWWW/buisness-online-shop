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

app.post('/admin', (req, res) => {
  res.send('post');
})

app.get('/basket', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/basket/basket.html'));
})

app.post('/basket', (req, res) => {
  res.send('post');
})

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
