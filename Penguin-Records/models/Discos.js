const mongoose = require("mongoose");

// Definindo o esquema do disco
const discoSchema = new mongoose.Schema({
  imagem: {
    // Imagem do álbum
    type: String,
    required: true, // A imagem é obrigatória
  },
  titulo: {
    // Título do álbum
    type: String,
    required: true,
  },
  artista: {
    // Nome do artista
    type: String,
    required: true,
  },
  ano: {
    // Ano de lançamento
    type: Number,
    required: true,
  },
  genero: {
    // Gênero do álbum
    type: String,
    required: true,
  },
  tipo: {
    // Tipo de lançamento (LP, CD, etc.)
    type: String,
  },
  copias: {
    // Número de cópias
    type: Number,
    default: 1,
  },
  descricao: {
    // Descrição do álbum
    type: String,
  },
  preco: {
    // Preço do disco
    type: String,
  },
});

// Criando o modelo a partir do esquema
const Disco = mongoose.model("Disco", discoSchema);

module.exports = Disco;