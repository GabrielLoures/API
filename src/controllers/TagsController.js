const knex = require("../database/knex");

class TagsController {

  async index(req, res) {

    const user_id = req.user.id;

    const tags = await knex("tags")
    .where({ user_id })
    .groupBy("name") // impede que apareçam tags repetidas na página "Home"; o groupBy() agrupa um conjunto de variáveis por um parâmetro (nesse caso escolhemos o "name")

    return res.json(tags);
    
  }

}

module.exports = TagsController;