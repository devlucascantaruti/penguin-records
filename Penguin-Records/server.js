const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth"); // Importar as rotas de autenticação
const axios = require("axios"); // Importa o axios
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static("public"));

// Importando o modelo Disco
const Disco = require("./models/Discos"); // Aponte para o arquivo correto

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

// Nova rota para criar um disco
app.post("/api/discos", async (req, res) => {
  const {
    imagem, // Caminho da imagem do álbum (por exemplo, 'images/disco1.jpg')
    titulo, // Título do álbum
    artista, // Nome do artista
    ano, // Ano de lançamento
    genero, // Gênero do álbum
    tipo, // Tipo de lançamento (LP, CD, etc.)
    copias, // Número de cópias
    descricao, // Descrição do álbum
    preco, // Preço do disco
  } = req.body;

  try {
    const novoDisco = new Disco({
      imagem, // Apenas o caminho da imagem (não o arquivo em si)
      titulo,
      artista,
      ano,
      genero,
      tipo,
      copias,
      descricao,
      preco,
    });

    await novoDisco.save(); // Salva o disco no banco de dados
    res.status(201).json(novoDisco); // Retorna o disco criado
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar o disco" }); // Retorna erro se falhar
  }
});

// Rota para obter todos os discos
app.get("/api/discos", async (req, res) => {
  try {
    const discos = await Disco.find();
    res.json(discos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter discos" });
  }
});

// Adicionando discos manualmente no banco de dados
app.post("/api/adicionarDiscos", async (req, res) => {
  const discos = [
    {
      imagem: "public/images/disco18.jpg",
      titulo: "Definitely Maybe",
      artista: "Oasis",
      ano: 1994,
      genero: "Rock",
      tipo: "Vinyl, LP, Album, Club Edition",
      copias: 26,
      descricao: "2 x Vinyl, LP, Album, Club Edition...",
      preco: "$44.00",
    },
    {
      imagem: "public/images/disco23.jpg",
      titulo: "The Low End Theory",
      artista: "A Tribe Called Quest",
      ano: 1990,
      genero: "Hip Hop",
      tipo: "Vinyl, LP, Album, Club Edition",
      copias: 30,
      descricao: "2 x Vinyl, LP, Album, Club Edition...",
      preco: "$45.00",
    },
    {
      imagem: "public/images/disco15.jpg",
      titulo: "Bem vindo Amizade",
      artista: "Jorge Ben Jor",
      ano: 1981,
      genero: "Rock",
      tipo: "Vinyl, LP, Album",
      copias: 15,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$40.00",
    },
    {
      imagem: "public/images/disco20.jpg",
      titulo: "Ride of me",
      artista: "P J Harvey",
      ano: 1993,
      genero: "MPB",
      tipo: "Vinyl, LP, Album",
      copias: 50,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$35.00",
    },
    {
      imagem: "public/images/disco25.jpg",
      titulo: "Ghosts... of the Civil Dead",
      artista: "Nick Cave",
      ano: 1989,
      genero: "Soundtrack",
      tipo: "Vinyl, LP, Album",
      copias: 40,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$50.00",
    },
    {
      imagem: "public/images/disco22.jpg",
      titulo: "Short n' Sweet",
      artista: "Sabrina Carpenter",
      ano: 2024,
      genero: "Pop",
      tipo: "Vinyl, LP, Album",
      copias: 25,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$42.00",
    },
    {
      imagem: "public/images/disco6.jpg",
      titulo: "Brat",
      artista: "Charli xcx",
      ano: 2024,
      genero: "Pop",
      tipo: "Vinyl, LP, Compilation",
      copias: 12,
      descricao: "2 x Vinyl, LP, Compilation...",
      preco: "$38.00",
    },
    {
      imagem: "public/images/disco11.jpg",
      titulo: "Pieces of a Man",
      artista: "Gil Scott-Heron",
      ano: 1971,
      genero: "Jazz Funk",
      tipo: "Vinyl, LP, Album",
      copias: 20,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$48.00",
    },
    {
      imagem: "public/images/disco16.jpg",
      titulo: "Imaginal Disk",
      artista: "Madagalena Bay",
      ano: 2015,
      genero: "Pop",
      tipo: "Vinyl, LP, Album",
      copias: 10,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$55.00",
    },
  ];

  try {
    for (const disco of discos) {
      const novoDisco = new Disco(disco);
      console.log(`Tentando adicionar o disco: ${disco.titulo}`);
      await novoDisco.save();
    }

    res.status(201).json({ message: "Discos adicionados com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar discos:", error);
    res.status(500).json({ error: "Erro ao adicionar discos" });
  }
});

// Rota para obter um disco específico
app.get("/api/discos/:id", async (req, res) => {
  try {
    const disco = await Disco.findById(req.params.id);
    if (!disco) {
      return res.status(404).json({ error: "Disco não encontrado" });
    }
    res.json(disco); // Retorna as informações do disco
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar disco" });
  }
});

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