import "dotenv/config";
import express from "express";
import cors from "cors";
import mariadb from "mariadb";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); //ele tranfomar as infomações da url em codigos para o mariaDB

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

app.post("/cadastro", async (req, res) => {
  const { produto } = req.body;

  if (!produto) {
    return res.status(400).json({ msg: "O campo produto é obrigatorio" });
  }

  let com;
  try {
    com = await pool.getConnection();
    const result = await com.query(
      "INSERT INTO produtos (produto) VALUES (?)",
      [produto],
    );
    res.status(201).json({
      msg: "Produto Adicionado com sucesso",
      id_inserido: Number(result.insertId),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Erro interno no servidor" });
  } finally {
    if (com) com.release();
  }
});

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
