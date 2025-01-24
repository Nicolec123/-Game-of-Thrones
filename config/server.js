/* importar o módulo do framework express */
const express = require('express');

/* importar o módulo do consign */
const consign = require('consign');

/* importar o módulo do body-parser */
const bodyParser = require('body-parser');

/* importar o módulo do express-validator */
const { check, validationResult } = require("express-validator")

/* importar o módulo do express-session */ 
const expressSession = require("express-session");


/* iniciar o objeto do express */
const app = express();

/* setar as variáveis 'view engine' e 'views' do express */
app.set('view engine', 'ejs');
app.set('views', './app/views');

/* configurar o middleware express.static */
app.use(express.static('./app/public'));

/* configurar o middleware body-parser */
app.use(bodyParser.urlencoded({extended: true}));

/* configurar o middleware express-session */ 
app.use(
  expressSession({
    secret: "chave-secreta", 
    resave: false, // Evita salvar a sessão novamente se não foi modificada
    saveUninitialized: true, // Salva sessões novas não inicializadas
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 dia de duração do cookie
    },
  })
)
/* configurar o middleware express-session */
// Middleware de validação de entrada
app.use((req, res, next) => { 
	//  validationResult depois para verificar erros 
	req.validationSessionResult = validationResult; next(); });

/* efetua o autoload das rotas, dos models e dos controllers para o objeto app */
consign()
	.include('app/routes')
	.then('config/dbConnection.js')
	.then('app/models')
	.then('app/controllers')
	.into(app);

/* exportar o objeto app */
module.exports = app;