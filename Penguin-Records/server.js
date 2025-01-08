const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static("public"));

// Importando o modelo Disco
const Disco = require("./models/Discos");

// Importando o modelo Lancamento
const Lancamento = require("./models/Lancamentos");

// Importando o modelo BlackFriday
const BlackFriday = require("./models/BlackFriday");

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

app.post("/api/lancamentos", async (req, res) => {
  const {
    imagem, // Caminho da imagem do lançamento
    titulo, // Título do lançamento
    artista, // Nome do artista
    ano, // Ano de lançamento
    genero, // Gênero do lançamento
    tipo, // Tipo de lançamento (LP, CD, etc.)
    copias, // Número de cópias
    descricao, // Descrição do lançamento
    preco, // Preço do lançamento
  } = req.body;

  try {
    const novoLancamento = new Lancamento({
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

    await novoLancamento.save(); // Salva o lançamento no banco de dados
    res.status(201).json(novoLancamento); // Retorna o lançamento criado
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar o lançamento" }); // Retorna erro se falhar
  }
});

// Rota para obter todos os lançamentos
app.get("/api/lancamentos", async (req, res) => {
  try {
    const lancamentos = await Lancamento.find();
    res.json(lancamentos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter lançamentos" });
  }
});

// Nova rota para criar um lançamento
app.post("/api/adicionarLancamentos", async (req, res) => {
  const lancamentos = [
    {
      imagem: "public/images/disco10.jpg",
      titulo: "Gal Costa",
      artista: "Gal Costa",
      ano: 1969,
      genero: "Psychedelic Rock, MPB, Avantgarde",
      tipo: "Vinyl, LP, Album",
      copias: 5,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$60.00",
    },
    {
      imagem: "public/images/disco29.jpg",
      titulo: "Get Yer Ya-Ya's Out! (The Rolling Stones In Concert)",
      artista: "The Rolling Stones",
      ano: 2024,
      genero: "Rock, Blues Rock",
      tipo: "Vinyl, LP, Album",
      copias: 58,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$20.00",
    },
    {
      imagem: "public/images/disco19.jpg",
      titulo: "Os Mutantes",
      artista: "Os Mutantes",
      ano: 1968,
      genero: "Psychedelic Rock, Rock, Experimental",
      tipo: "Vinyl, LP, Album",
      copias: 43,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$50.00",
    },
    {
      imagem: "public/images/disco1.jpg",
      titulo: "Talking Book",
      artista: "Stevie Wonder",
      ano: 1972,
      genero: "Soul, Funk, Jazz",
      tipo: "Vinyl, LP, Album",
      copias: 30,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$45.00",
    },
    {
      imagem: "public/images/disco2.jpg",
      titulo: "Voulez-Vous",
      artista: "ABBA",
      ano: 1979,
      genero: "Disco, Europop",
      tipo: "Vinyl, LP, Album",
      copias: 50,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$40.00",
    },
    {
      imagem: "public/images/disco5.jpg",
      titulo: "The Freewheelin' Bob Dylan",
      artista: "Bob Dylan",
      ano: 1963,
      genero: "Blues, Folk",
      tipo: "Vinyl, LP, Album",
      copias: 25,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$42.00",
    },
    {
      imagem: "public/images/disco28.jpg",
      titulo: "Songs of a Lost World",
      artista: "The Cure",
      ano: 2024,
      genero: "Alternative Rock",
      tipo: "Vinyl, LP, Bioplastic",
      copias: 109,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$32.90",
    },
    {
      imagem: "public/images/disco9.jpg",
      titulo: "Immunity",
      artista: "Clairo",
      ano: 2019,
      genero: "Indie Pop, Bedroom Pop",
      tipo: "Vinyl, LP, Album",
      copias: 35,
      descricao: "2 x Vinyl, LP, Album...",
      preco: "$38.00",
    },
  ];

  try {
    for (const lancamento of lancamentos) {
      console.log(`Tentando adicionar o lançamento: ${lancamento.titulo}`);
      const novoLancamento = new Lancamento(lancamento);
      await novoLancamento.save();
      console.log(`Lançamento adicionado com sucesso: ${lancamento.titulo}`);
    }
    res.status(201).json({ message: "Lançamentos adicionados com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar lançamentos:", error);
    res.status(500).json({ error: "Erro ao adicionar lançamentos" });
  }

  });

app.post("/api/adicionarBlackFriday", async (req, res) => {
  const blackFridayDiscos = [
    {
      imagem: "public/images/disco30.jpg",
      titulo: "From Zero",
      artista: "Linkin Park",
      ano: 2024,
      genero: "Rock, Alternative Rock",
      tipo: "Vinyl, LP, Album",
      copias: 124,
      descricao: "124 copies from $27.37",
      preco: "$27.37",
    },
    {
      imagem: "public/images/disco34.jpg",
      titulo: "Alligator Bites Never Heal",
      artista: "Doechii",
      ano: 2024,
      genero: "Hip Hop, Funk/Soul",
      tipo: "Vinyl, LP, Mixtape",
      copias: 4,
      descricao: "4 copies from $79.99",
      preco: "$79.99",
    },
    {
      imagem: "public/images/disco35.jpg",
      titulo: "Purple Rarities",
      artista: "Stone Temple Pilots",
      ano: 2024,
      genero: "Rock",
      tipo: "Vinyl, LP, Record Store Day",
      copias: 2,
      descricao: "2 copies from $199.99",
      preco: "$199.99",
    },
    {
      imagem: "public/images/disco33.jpg",
      titulo: "Operation: Doomsday",
      artista: "MF Doom",
      ano: 2024,
      genero: "Hip Hop",
      tipo: "2 x Vinyl LP, Record Store Day",
      copias: 27,
      descricao: "27 copies from $39.98",
      preco: "$39.98",
    },
    {
      imagem: "public/images/disco32.jpg",
      titulo: "Dawg '90 Deluxe Edition",
      artista: "David Grisman",
      ano: 2024,
      genero: "Jazz, Folk, Bluegrass",
      tipo: "2 x Vinyl, LP, Album, Record Store Day",
      copias: 7,
      descricao: "7 copies from $41.29",
      preco: "$41.29",
    },
    {
      imagem: "public/images/disco36.jpg",
      titulo: "Absolute Elsewhere",
      artista: "Blood Incantation",
      ano: 2024,
      genero: "Electronic, Rock, Death Metal",
      tipo: "Vinyl, LP, Limited Edition",
      copias: 26,
      descricao: "26 copies from $29.46",
      preco: "$29.46",
    },
    {
      imagem: "public/images/disco37.jpg",
      titulo: "The SpongeBob SquarePants Movie",
      artista: "Various",
      ano: 2024,
      genero: "Electronic, Rock, Soundtrack",
      tipo: "Vinyl, LP, Record Store Day",
      copias: 42,
      descricao: "42 copies from $22.00",
      preco: "$22.00",
    },
    {
      imagem: "public/images/disco38.jpg",
      titulo: "I Want To Hold Your Hand / I Saw Her Standing There",
      artista: "The Beatles",
      ano: 2024,
      genero: "Rock, Rock & Roll",
      tipo: 'Vinyl, "7", 45 RPM, Record Store Day',
      copias: 180,
      descricao: "180 copies from $14.74",
      preco: "$14.74",
    },
    {
      imagem: "public/images/disco39.jpg",
      titulo: "I Lay Down My Life For You",
      artista: "JPEGMAFIA",
      ano: 2024,
      genero: "Hip Hop, Rock, Experimental",
      tipo: "2 x Vinyl, LP",
      copias: 5,
      descricao: "5 copies from $80.00",
      preco: "$80.00",
    },
  ];

  try {
    for (const disco of blackFridayDiscos) {
      const novoDisco = new BlackFriday(disco);
      await novoDisco.save();
    }
    res
      .status(201)
      .json({ message: "Discos de Black Friday adicionados com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar discos de Black Friday" });
  }
});

// Rota para criar um disco de Black Friday
app.post("/api/blackfriday", async (req, res) => {
  try {
    const novoDisco = new BlackFriday(req.body);
    await novoDisco.save();
    res.status(201).json(novoDisco);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao adicionar o disco de Black Friday" });
  }
});

// Rota para obter todos os discos de Black Friday
app.get("/api/blackfriday", async (req, res) => {
  try {
    const blackFridayDiscos = await BlackFriday.find();
    res.json(blackFridayDiscos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter discos de Black Friday" });
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