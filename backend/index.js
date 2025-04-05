const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const SCORES_FILE = path.join(__dirname, "scores.json");

console.log("Caminho real do scores.json:", SCORES_FILE);

app.use(cors());
app.use(express.json());

function readScores() {
  if (!fs.existsSync(SCORES_FILE)) return [];
  const data = fs.readFileSync(SCORES_FILE);
  return JSON.parse(data);
}

function writeScores(scores) {
    try {
      console.log("Salvando pontuações no arquivo...");
      fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
      console.log("Salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar pontuação:", err);
    }
  }
  
  app.post("/scores", (req, res) => {
    const { name, score } = req.body;
    console.log("POST /scores recebido:", { name, score });
  
    if (!name || typeof score !== "number") {
      console.log("Dados inválidos:", { name, score });
      return res.status(400).json({ error: "Nome ou pontuação inválidos" });
    }
  
    const scores = readScores();
    scores.push({ name, score, date: new Date().toISOString() });
  
    writeScores(scores);
    res.json({ message: "Pontuação salva com sucesso!" });
  });
  

app.get("/", (req, res) => {
  res.send("Servidor da cobrinha 🐍 está online!");
});

app.post("/scores", (req, res) => {
  const { name, score } = req.body;

  console.log("Recebendo pontuação:", name, score); // <--- adicione isso aqui

  if (!name || typeof score !== "number") {
    return res.status(400).json({ error: "Nome ou pontuação inválidos" });
  }

  const scores = readScores();
  scores.push({ name, score, date: new Date().toISOString() });
  writeScores(scores);

  res.json({ message: "Pontuação salva com sucesso!" });
});

app.get("/scores", (req, res) => {
  const scores = readScores()
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  res.json(scores);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
