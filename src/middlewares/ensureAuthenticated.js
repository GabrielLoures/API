const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError")
const authConfig = require("../configs/auth")

function ensureAuthenticated(req, res, next) {

  const authHeader = req.headers.authorization;

  if(!authHeader) {
    throw new AppError("JWT Token não informado", 401)
  }

  const [, token] = authHeader.split(" ") // o token vem escrito no padrão "Bare xxxxxxxx"; por isso usamos esse código, para excluir o Bare e manter somente o token de fato => no array da const colcoamos que o primeiro argumento separado pelo split (no caso o Bare) não será guardado em nada (por isso a vírgula vazia) e o segundo argumento (no caso a string do próprio token) guardamos na variável token

  try {

    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    req.user = {
      id: Number(user_id)
    }

    return next();

  } catch {

    throw new AppError("JWT Token Inválido", 401)
    
  }

}

module.exports = ensureAuthenticated;