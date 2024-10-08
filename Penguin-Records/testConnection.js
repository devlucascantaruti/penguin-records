require("dotenv").config(); // Carrega variáveis do .env
const { MongoClient } = require("mongodb");

async function run() {
  const uri = process.env.MONGO_URI; // Lê a string de conexão do .env
  const client = new MongoClient(uri);

  try {
    // Conecta ao cliente
    await client.connect();
    console.log("Conexão bem-sucedida ao MongoDB!");

    // Opcional: você pode listar os bancos de dados para verificar a conexão
    const databasesList = await client.db().admin().listDatabases();
    console.log("Bancos de dados:");
    databasesList.databases.forEach((db) => {
      console.log(` - ${db.name}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  } finally {
    // Fecha a conexão
    await client.close();
  }
}

run().catch(console.error);