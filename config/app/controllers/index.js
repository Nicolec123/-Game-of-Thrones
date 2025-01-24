const { check, validationResult } = require("express-validator")
const { connMongoDB } = require("../../config/dbConnection")
const UsuariosDAO = require("../models/UsuariosDAO")
module.exports.index = function (application, req, res) {
  res.render("index", { validacao: {}, dadosForm: {} })
}

module.exports.autenticar = async function (application, req, res) {
  const dadosForm = req.body

  // Validações
  await Promise.all([
    check("usuario")
      .notEmpty()
      .withMessage("Campo usuario não pode ser vazio")
      .run(req),
    check("senha")
      .notEmpty()
      .withMessage("Campo senha não pode ser vazio")
      .run(req),
  ])
  const erros = validationResult(req)

  if (!erros.isEmpty()) {
    return res.render("index", { validacao: erros.array(), dadosForm })
  }

  try {
    const db = await connMongoDB() // Obtém o banco conectado
    const usuariosDAO = UsuariosDAO(db) // Instancia o DAO
    const usuario = await usuariosDAO.LogarUsuario(dadosForm) // Verifica o login

    // Armazena o usuário na sessão
    req.session.usuario = {
      id: usuario._id,
      nome: usuario.usuario,
    }

    console.log("Usuário autenticado:", req.session.usuario)
    return res.redirect("/jogo") // Redireciona para a área logada
  } catch (err) {
    console.error("Erro ao autenticar usuário:", err)
    return res.status(401).render("index", {
      validacao: [{ msg: "Usuário ou senha inválidos." }],
      dadosForm,
    })
  }
}
