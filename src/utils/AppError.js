// Arquivo que tem como objetivo padronizar qual o tipo de mensagem que vai aparecer quando tivermos algum tipo de excessão

class AppError {
  
  // criamos as variáveis abaixo

  message;
  statusCode;

  // um constructor é um método que é carregado automaticamente quando a classe é instanciada

  constructor(message, statusCode = 400) { // deixamos o status code padronizado em 400 (bad request) 

    this.message = message;
    this.statusCode = statusCode;

  }

}

module.exports = AppError;