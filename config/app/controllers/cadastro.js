const { check, validationResult } = require("express-validator")
const { connMongoDB } = require("../../config/dbConnection")
const UsuariosDAO = require("../models/UsuariosDAO")

module.exports.cadastro = function (application, req, res) {
  res.render("cadastro", { validacao: {}, dadosForm: {} }) // Renderiza a página de cadastro
}

module.exports.cadastrar = async function (application, req, res) {
  const dadosForm = req.body

  // Validações
  await Promise.all([
    check("nome")
      .notEmpty()
      .withMessage("Campo Nome não pode ser vazio")
      .run(req),
    check("usuario")
      .notEmpty()
      .withMessage("Campo Usuario não pode ser vazio")
      .run(req),
    check("senha")
      .notEmpty()
      .withMessage("Campo Senha não pode ser vazio")
      .run(req),
    check("casa")
      .notEmpty()
      .withMessage("Campo Casa não pode ser vazio")
      .run(req),
  ])

  const erros = validationResult(req)

  if (!erros.isEmpty()) {
    return res.render("cadastro", { validacao: erros.array(), dadosForm })
  }
  console.log(connMongoDB) // Deve mostrar que é uma função
  try {
    const db = await connMongoDB() // Obtém o banco conectado
    const usuariosDAO = UsuariosDAO(db) // Chama a função corretamente
    await usuariosDAO.verificarConexao() // Verifica a conexão
    await usuariosDAO.inserirUsuario(dadosForm) // Insere o usuário
    res.send("Usuário cadastrado com sucesso!")
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err)
    res.status(500).send("Erro interno do servidor") // deu ruim!
  }
}
