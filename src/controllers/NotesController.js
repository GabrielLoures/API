const knex = require('../database/knex');

class NotesController {

  async create(req, res) {
    
    const { title, description, tags, links } = req.body;

    const user_id = req.user.id;

    const note_id = await knex("notes").insert({ // com o knex fica fácil inserirmos os dados que queremos com o insert([]), passando um objeto com os dados que queremos inserir
      title,
      description,
      user_id
    })

    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      }
    })

    await knex("links").insert(linksInsert);

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex("tags").insert(tagsInsert);

    return res.json();

  }

  async show(req, res) {

    const { id } = req.params;

    const note = await knex("notes").where({ id }).first(); // comando para selecionar a nota que queremos através do id e sendo sempre a primeira nota

    const tags = await knex("tags").where({ note_id: id }).orderBy("name"); // comando para selecionar as tags de acordo com o id das notas e mostrá-las em ordem alfabética (orderBy("name"))

    const links = await knex("links").where({ note_id: id }).orderBy("created_at");

    return res.json({
      ...note, // despeja todos os detalhes da nota
      tags,
      links
    });

  }

  async delete(req, res) {

    const { id } = req.params;

    await knex("notes").where({ id }).delete();

    return res.json();
  }

  async index(req, res) {

    const { title, tags } = req.query; // pegamos através do query criado no Insomnia na aba "Query"

    const user_id = req.user.id;

    let notes

    if(tags) {

      const filterTags = tags.split(',').map(tag => tag.trim()) // criamos um objeto com as tags separadas por vírgula

      notes = await knex("tags")
      .select([ // fazemos as seleções dos campos que queremos, colocando eles entre "" e com o nome da tabela antes dos campos, separados por ponto 
        "notes.id",
        "notes.title",
        "notes.user_id"
      ])
      .where("notes.user_id", user_id)
      .whereLike("notes.title", `%${title}%`)
      .whereIn("name", filterTags)
      .innerJoin("notes", "notes.id", "tags.note_id") // comando para conectar uma tabela com outra, onde no primeiro parâmetro colocamos qual tabela iremos usar, no segundo e no terceiro colocamos quais campos são comuns entre as tabelas (notes e tags)
      .groupBy("notes.id") // impede de trazer notas repetidas
      .orderBy("notes.title")

    } else {
      notes = await knex("notes")
          .where({ user_id })
          .whereLike("title", `%${title}%`) // whereLike ajuda a buscar por valores parecidos com uma palavra por exemplo; no primeiro parâmetro vem em qual campo queremos que o whereLike busque e no segundo parâmetro colocamos a variável da busca entre %, que faz com que o banco verifique se em qualquer parte do campo "title" existe a variável que eu estou buscando
          .orderBy("title")
    }

    const userTags = await knex("tags").where({ user_id })

    const notesWithTags = notes.map( note => {
      const noteTags = userTags.filter( tag => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags
      }
    })
  
    return res.json(notesWithTags);
  }

}

module.exports = NotesController;