const { Router } = require('express'); // esse arquivo não conhece o app. que vamos utilizar abaixo, então temos que importar o Router do Express
const multer = require('multer');
const uploadConfig = require("../configs/upload");

const UsersController = require('../controllers/UsersController'); // puxamos as funcionalidades do UsersController para esse arquivo
const UserAvatarController = require('../controllers/UserAvatarController');

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersController = new UsersController(); // criamos uma nova instância para as funcionalidades do UsersController; agora podemos utilizar as funções que criamos no arquivo UsersController.js nesse arquivo aqui
const userAvatarController = new UserAvatarController();


const usersRoutes = Router(); // transformamos o Router que importamos em uma constante para usarmos abaixo no lugar no app.

const upload = multer(uploadConfig.MULTER);


function myMiddleware(req, res, next) {

  console.log('Voce passou pelo Middleware')

  next(); // funcionalidade que chama a próxima função a ser executada na pilha do middleware (no caso a usersController); sem esse next(), a requisição fica carregando eternamente no Insomnia

}

usersRoutes.post("/", myMiddleware, usersController.create); // como no arquivo index.js na linha 9 colocamos o radical "/users", aqui podemos utilizar somente o "/"

usersRoutes.put("/", ensureAuthenticated ,usersController.update); // como no usersController.js, no update() nós usamos a variável 'id' como parâmetro (body.params), temos que colocá-la no endereço aqui

usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)

module.exports = usersRoutes; // usamos esse comando para expor as rotas criadas para o arquivo server.js poder utilizá-las