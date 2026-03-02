require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Rotas de usuários (mantendo o prefixo /api/usuarios do projeto original)
app.use("/api/usuarios", userRoutes);

// Middleware global de tratamento de erros (inclui erros do Prisma)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

