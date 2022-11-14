// Para criar tabelas

exports.up = knex => knex.schema.createTable("notes", table => {

  table.increments("id"); // dentro da tabela teremos um campo com incremento chamado 'id'

  table.text('title'); // criamos uma coluna do tipo texto com o nome de "title"

  table.text('description');

  table.integer('user_id').references('id').inTable('users'); // criamos um campo do tipo numérico(integer) 'users_id', que faz referência ao campo 'id' da tabela 'users'

  table.timestamp('created_at').default(knex.fn.now()); // criamos uma coluna do tipo timestamp e temos que usar a função do knex no default (knex.fn.now()) para pegar o tempo atual

  table.timestamp('updated_at').default(knex.fn.now());

});

// Para deletar tabelas

exports.down = knex => knex.schema.dropTable("notes");
