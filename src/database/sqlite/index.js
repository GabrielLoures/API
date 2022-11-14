// Criação das constantes do sqlite 

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const path = require('path'); // o path é uma biblioteca que vem junto com o Node.js, ele ajuda a criarmos os endereços de acordo com o ambiente 

// Funcionalidade de assincronismo

async function sqliteConnection() {
  const database = await sqlite.open({
    filename: path.resolve(__dirname, '..', 'database.db'), // pega o diretório que estamos, que no caso é a pasta sqlite (__dirname), volta uma pasta ('..') e criamos um arquivo chamado   'database.db'
    driver: sqlite3.Database // dizemos qual driver nós vamos utilizar (no caso será o sqlite3 que instalamos pelo terminal)
  })
  
  return database
}

module.exports = sqliteConnection;