const userService = require("../services/userService");

async function createUser(req, res, next) {
  try {
    const { nome, email, senha, perfil_nome } = req.body;

    const user = await userService.createUser({
      nome,
      email,
      senha,
      perfil_nome,
    });

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();

    return res.json({
      mensagem: "Usuários encontrados com sucesso",
      users,
    });
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(Number(id));

    return res.json({
      mensagem: "Usuário encontrado com sucesso",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { nome, email, senha, perfil_nome } = req.body;

    const user = await userService.updateUser(Number(id), {
      nome,
      email,
      senha,
      perfil_nome,
    });

    return res.json({
      mensagem: "Usuário atualizado com sucesso",
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    await userService.deleteUser(Number(id));

    return res.json({
      mensagem: "Usuário removido com sucesso",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
};

