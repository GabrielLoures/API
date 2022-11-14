
exports.up = knex => knex.schema.createTable("tags", table => {

  table.increments("id");

  table.text('name').notNullable(); // colocamos o notNullable() para evitar o valor null nesse campo

  table.integer('note_id').references('id').inTable('notes').onDelete("CASCADE"); // o comando onDelete("CASCADE") quer dizer que, se a nota da table 'notes' a que a tag está vinculada for deletada, as tags vinculadas a ela serão automaticamente deletadas também

  table.integer('user_id').references('id').inTable('users');

});

exports.down = knex => knex.schema.dropTable("tags");
