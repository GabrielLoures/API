// Para não precisarmos ficar repetindo linha de importação no server.js para cada rota que criamos na routes.js, criamos esse arquivo index.js para podermos juntar todas as toras criadas e enviá-las ao server.js

const { Router } = require('express');

const usersRoutes = require('./users.routes') // importamos o arquivo users.routes

const notesRoutes = require('./notes.routes') // importamos o arquivo notes.routes

const tagsRoutes = require('./tags.routes') // importamos o arquivo notes.routes

const sessionsRoutes = require('./sessions.routes') // importamos o arquivo sessions.routes

const routes = Router();

routes.use("/users", usersRoutes) // por essa linha de código, estamos pedindo para que toda vez que /users for acessado, o usersRoutes deve ser acessado
routes.use("/notes", notesRoutes) 
routes.use("/tags", tagsRoutes)
routes.use("/sessions", sessionsRoutes)

module.exports = routes; // exportamos para usar no server


