const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

const SALT_ROUNDS = 10;

async function createUser(data) {
  const { nome, email, senha, perfil_nome } = data;

  const hashedPassword = await bcrypt.hash(senha, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      nome,
      email,
      senha: hashedPassword,
      profile: {
        create: {
          perfil_nome,
        },
      },
    },
    select: {
      id: true,
      nome: true,
      email: true,
      id_perfil: true,
      created_at: true,
      updated_at: true,
      profile: {
        select: {
          id: true,
          perfil_nome: true,
        },
      },
    },
  });

  return user;
}

async function listUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      nome: true,
      email: true,
      id_perfil: true,
      created_at: true,
      updated_at: true,
      profile: {
        select: {
          id: true,
          perfil_nome: true,
        },
      },
    },
  });

  return users;
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      nome: true,
      email: true,
      id_perfil: true,
      created_at: true,
      updated_at: true,
      profile: {
        select: {
          id: true,
          perfil_nome: true,
        },
      },
    },
  });

  if (!user) {
    const error = new Error("Usuário não encontrado.");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

async function updateUser(id, data) {
  const { nome, email, senha, perfil_nome } = data;

  const updateData = {};

  if (nome !== undefined) updateData.nome = nome;
  if (email !== undefined) updateData.email = email;
  if (senha !== undefined) {
    updateData.senha = await bcrypt.hash(senha, SALT_ROUNDS);
  }

  const profileUpdate =
    perfil_nome !== undefined
      ? {
          profile: {
            update: {
              perfil_nome,
            },
          },
        }
      : {};

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...updateData,
      ...profileUpdate,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      id_perfil: true,
      created_at: true,
      updated_at: true,
      profile: {
        select: {
          id: true,
          perfil_nome: true,
        },
      },
    },
  });

  return user;
}

async function deleteUser(id) {
  await prisma.user.delete({
    where: { id },
  });
}

module.exports = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
};

