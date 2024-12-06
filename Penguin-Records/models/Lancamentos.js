const mongoose = require("mongoose");

// Definindo o esquema do lançamento
const lancamentoSchema = new mongoose.Schema({
  imagem: {
    type: String,
    required: true, // A imagem é obrigatória
  },
  titulo: {
    type: String,
    required: true,
  },
  artista: {
    type: String,
    required: true,
  },
  ano: {
    type: Number,
    required: true,
  },
  genero: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
  },
  copias: {
    type: Number,
    default: 1,
  },
  descricao: {
    type: String,
  },
  preco: {
    type: String,
  },
});

// Criando o modelo a partir do esquema
const Lancamento = mongoose.model("Lancamento", lancamentoSchema);

module.exports = Lancamento;