const { hash, compare } = require('bcryptjs');

const AppError = require('../utils/AppError');

const sqliteConnection = require('../database/sqlite');
const { request } = require('express');

class UsersController { // usamos classe nesse escopo porque vamos utilizar várias funções, então a classe faz mais sentido. Um controller pode ter no máximo 5 métodos ou funções (questão de boa prática). Listei abaixo as 5 funcionalidades que um controller pode ter. Não necessariamente ele deve ter essas 5.
  
  // index - GET para listar vários resgistros

  // show - GET para exibir um registro específico
  
  // create - POST para criar um registro
    
    async create(req, res) {

      const { name, email, password } = req.body;

      const database = await sqliteConnection();

      const checkUserExist = await database.get("SELECT * FROM users WHERE email = (?)", [email]) // colocamos o ? para inserirmos o conteúdo de uma variável e após a vírgula, colocamos entre [] a variável que queremos que substitua o ?; se quiséssemos mais de uma variável, bastava colocar mais ? e entre [] colocar as variáveis na ordem em que aparecem os ?

      if(checkUserExist) {
        throw new AppError("Este e-mail já está cadastrado!")
      }

      const hashedPassword = await hash(password, 8) // usamos a função hash() que vem no pacote do bcryptjs, onde no primeiro parämetro colocamos qual variável nós vamos criptografar e no segundo parâmetro colocamos o grau de complexidade da criptografia -> segundo o professor, grau 8 está de bom tamanho; PS: temos que usar o await no hash() já que ele é uma promise

      await database.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      ) // comando para colocarmos os valores do JSON no Insomnia para o banco de dados 'users' do Beekeeper

      return res.status(201).json();

    }

  // update - PUT para atualizar um registro
    
    async update(req, res) {

      const { name, email, password, old_password } = req.body;
      const user_id = req.user.id;

      const database = await sqliteConnection(); // fazemos nossa conexão com o banco de dados
      const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

      if(!user) {
        throw new AppError("Usuário não encontrado!")
      }

      const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

      if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) { // lógica para que o usuário não mude o email para um email já existente
        throw new AppError("Este e-mail já está em uso");
      }
      
      user.name = name ?? user.name; // Significado do lado direito da equação: se houver conteúdo na variável 'name', use ela, senão, continue usando a variável 'user.name'
      user.email = email ?? user.email;

      if(password && !old_password) {
        throw new AppError("Você precisa informar a senha antiga para definir sua nova senha")
      }

      if (password && old_password) {
        const checkOldPassword = await compare(old_password, user.password); // o compare() é uma funcionalidade do pacote do bcryptjs para verificarmos se as senhas criptografadas são iguais

        if(!checkOldPassword) {
          throw new AppError("As senhas não conferem. Digite novamente.")
        }

        user.password = await hash(password, 8);
      }

      await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?
      `, [user.name, user.email, user.password, user_id]) // a função DATETIME('now') é do banco de dados que pega a data e hora do momento

      return res.status(200).json();
    }

  // delete - DELETE para deletar um registro

}

module.exports = UsersController;