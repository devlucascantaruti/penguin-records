const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// Configuração do Nodemailer para Sendinblue
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "7d94a8001@smtp-brevo.com", // Seu e-mail de envio
    pass: process.env.SENDINBLUE_API_KEY, // Sua chave de API do Sendinblue
  },
});

// Registrar um novo usuário
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Verificação de valores inseridos
  console.log({ username, email, password }); // Para verificar os valores

  try {
    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existe!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Enviar e-mail de confirmação
    const mailOptions = {
      from: "7d94a8001@smtp-brevo.com", // Seu e-mail de envio
      to: email,
      subject: "Confirmação de Registro",
      text: `Olá ${username},\n\nObrigado por se registrar na nossa plataforma!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Fazer login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ error: "Usuário não encontrado!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Senha incorreta!" });

    // Geração do token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
