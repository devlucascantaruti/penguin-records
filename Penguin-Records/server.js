const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth"); // Importar as rotas de autenticação
const axios = require("axios"); // Importa o axios
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors()); // Habilitar CORS
app.use(bodyParser.json()); // Parsear JSON

// Rotas
app.use("/api/auth", authRoutes); // Configurar as rotas de autenticação

// Nova rota para a API do YouTube
app.get("/api/youtube/playlist", async (req, res) => {
  const playlistId = req.query.playlistId; // Obtém o parâmetro playlistId da URL
  const apiKey = process.env.YOUTUBE_API_KEY; // Chave da API (definida no .env)

  // Verifica se o playlistId foi fornecido
  if (!playlistId) {
    return res.status(400).json({ error: "Playlist ID é obrigatório" });
  }

  try {
    // Monta a URL da API do YouTube com a chave e o ID da playlist
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}`;

    // Faz a requisição para a API do YouTube
    const response = await axios.get(apiUrl);

    // Retorna os dados recebidos da API para o front-end
    res.json(response.data);
  } catch (error) {
    // Se ocorrer algum erro, responde com erro
    console.error("Erro ao buscar dados do YouTube:", error);
    res.status(500).json({ error: "Erro ao buscar dados do YouTube" });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});