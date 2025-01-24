module.exports = function (application) {
  application.get("/", (req, res) => {
    application.app.controllers.index.index(application, req, res)
  })

  application.post("/autenticar", (req, res) => {
    application.app.controllers.index.autenticar(application, req, res)
  })

  // Rota protegida com middleware
  application.get("/jogo", verificaAutenticacao, (req, res) => {
    //res.send(`Bem-vindo, ${req.session.usuario.nome}!`)
		application.app.controllers.jogo.jogo(application, req, res)

  })
}

// Middleware de verificação de autenticação
function verificaAutenticacao(req, res, next) {
  if (req.session && req.session.usuario) {
    return next() // Continua se o usuário estiver autenticado
  }
  return res.redirect("/") // Redireciona para o login se não autenticado
}
