/* importar as configurações do servidor */
var app = require('./config/server');

/* parametrizar a porta de escuta */
app.listen(8087
	, function(){
	console.log('Servidor online');
})