import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
  knex.schema
    .createTable("contacts", function (table) {
      table.increments("contactId");
      table.string("name").notNullable();
      table.string("email");
      table.string("phone");
      table.string("adress").notNullable();
      table.timestamps(true, true);
    })
    .then();
}

export async function down(knex: Knex): Promise<any> {
  knex.schema.dropTable("contacts").then();
}
