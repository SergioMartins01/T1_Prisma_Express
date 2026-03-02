function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === "P2002") {
    return res.status(409).json({
      mensagem: "Já existe um registro com os dados informados (por exemplo, email duplicado).",
      detalhe: err.meta,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      mensagem: "Registro não encontrado.",
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      mensagem: err.message,
    });
  }

  return res.status(500).json({
    mensagem: "Erro interno do servidor.",
  });
}

module.exports = errorHandler;

