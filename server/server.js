import express from "express";

const PORT = 4040;
const app = express();

app.get("/", (req, res) => {
  res.send("the endpoint is working");
});

app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});
