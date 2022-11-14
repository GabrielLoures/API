module.exports = {

  jwt: {
    secret: process.env.AUTH_SECRET || "default", // frase secreta (utilizamos o site md5hash para criar um hash aleatório e jogamos ele lá no arquivo .env; a partir dele, acessamos o secret)
    expiresIn: "1d" // tempo de expiração do token (nesse caso, 1 dia)
  }

}