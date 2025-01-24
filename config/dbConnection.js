
const { MongoClient } = require("mongodb")

const connMongoDB = async () => {
  const uri = "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    console.log("Conectando ao MongoDB...")
    await client.connect()
    console.log("Conexão com MongoDB estabelecida com sucesso.")
    return client.db("got")
  } catch (err) {
    console.error("Erro ao conectar ao MongoDB:", err)
    throw err
  }
}

module.exports = { connMongoDB } // exportação está assim
