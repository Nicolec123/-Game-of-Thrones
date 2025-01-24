module.exports = function (application) {
  application.get("/cadastro", function (req, res) {
    application.app.controllers.cadastro.cadastro(application, req, res)
  })

  // cadastrar(envia o cadastro)
  application.post("/cadastrar", function (req, res) {
    application.app.controllers.cadastro.cadastrar(application, req, res)
  })

  // volta para a tela inicial para se logar
  application.get("/", (req, res) => {
    application.app.controllers.index.index(application, req, res)
  })

}
