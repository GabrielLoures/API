require("dotenv/config");
require('express-async-errors'); // puxamos a biblioteca express-async-errors

const migrationRun = require('./database/sqlite/migrations')

const AppError = require('./utils/AppError')

const express = require('express');

const cors = require('cors');

const uploadConfig = require("./configs/upload");

const routes = require('./routes'); // por padrão, quando não colocamos qual arquivo da pasta nós queremos carregar, ele carrega sempre o index.js

const app = express();

migrationRun();

app.use(express.json());

app.use(cors());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes);

app.use((error, req, res, next) => { // esse é uma funcionalidade padrão de mensagens de erro (nesse caso não estamos utilizando o req e next, mas esse é o padrão do escopo de erro, então mantemos eles ai)
  if(error instanceof AppError) { // essa linha representa um erro causado pelo cliente 
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  return res.status(500).json({ // essa linha representa um erro causado pelo servidor/código
    status: "error",
    message: "Internal Server Error"
  })
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
}); // app.listen cria uma porta número X (pode ser qualquer número, nesse caso utilizamos 3000) e colocamos uma arrow function para dar uma mensagem de que o server foi iniciado no terminal