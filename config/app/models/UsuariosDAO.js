//modo bcrypt
const bcrypt = require("bcrypt")
 
// Define uma função `UsuariosDAO` que recebe um banco de dados (`db`) como argumento
const UsuariosDAO = (db) => {
  // Retorna um objeto com três métodos: verificarConexao, inserirUsuario e LogarUsuario
  return {
    // Método para verificar a conexão e a existência da coleção 'usuarios'
    verificarConexao: async () => {
      try {
        // Obtém a lista de coleções no banco de dados e a converte para um array
        const listaDeColecoes = await db.listCollections().toArray()
        console.log("Coleções disponíveis:", listaDeColecoes) // Exibe as coleções disponíveis no console

        // Tenta acessar a coleção 'usuarios' no banco de dados
        const usuariosColecao = db.collection("usuarios")
        if (!usuariosColecao) {
          // Lança um erro caso a coleção 'usuarios' não seja encontrada
          throw new Error("Coleção 'usuarios' não encontrada.")
        }
        console.log("Coleção 'usuarios' encontrada com sucesso.") // Confirma que a coleção foi encontrada

        return db // Retorna o banco de dados conectado
      } catch (err) {
        // Trata qualquer erro que ocorrer durante a conexão ou verificação da coleção
        console.error(
          "Erro ao conectar ao banco de dados ou verificar coleção:",
          err
        )
        throw new Error("Banco de dados não está correto.") // Lança um erro genérico para quem chamou
      }
    },

    // Método para inserir um novo usuário no banco de dados criptografado
    inserirUsuario: async (dadosForm) => {
      try {
        const usuariosColecao = db.collection("usuarios")

        // Gera o hash da senha com salt
        const saltRounds = 10 // Número de rounds para gerar o salt
        const senhaCriptografada = await bcrypt.hash(
          dadosForm.senha,
          saltRounds
        )

        // Atualiza o campo `senha` com a senha criptografada
        dadosForm.senha = senhaCriptografada

        // Insere o documento no banco de dados
        await usuariosColecao.insertOne(dadosForm)
      } catch (err) {
        console.error("Erro ao inserir usuário:", err)
        throw new Error("Erro ao inserir o usuário no banco de dados.")
      }
    },

    // Método para autenticar um usuário no sistema
    LogarUsuario: async (dadosForm) => {
      try {
        const usuariosColecao = db.collection("usuarios")

        // Procura um documento na coleção com o campo `usuario` correspondente
        const usuario = await usuariosColecao.findOne({
          usuario: dadosForm.usuario, // Campo 'usuario' do formulário
        })

        if (!usuario) {
          // Se nenhum usuário for encontrado, lança um erro
          throw new Error("Usuário ou senha inválidos.")
        }

        // Verifica se a senha fornecida corresponde ao hash armazenado
        const senhaValida = await bcrypt.compare(dadosForm.senha, usuario.senha)

        if (!senhaValida) {
          // Se a senha não for válida, lança um erro
          throw new Error("Usuário ou senha inválidos.")
        }

        // Se tudo estiver correto, retorna os dados do usuário autenticado
        return usuario
      } catch (err) {
        // Trata erros relacionados à autenticação
        console.error("Erro ao logar usuário:", err)
        throw new Error("Erro ao autenticar o usuário.")
      }
    },
  }
}

// Exporta a função `UsuariosDAO` para ser usada em outros módulos
module.exports = UsuariosDAO
