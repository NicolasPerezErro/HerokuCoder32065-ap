import { config } from '../src/config.js';
import knex from 'knex';

//------------------------------------------
// productos en MariaDb

const mariaDbClient = knex(config.mariaDb);

await mariaDbClient.schema.dropTableIfExists('productos')

mariaDbClient.schema.createTable('productos', table => {
    table.increments('id')
    table.string('title')
    table.integer('price')
    table.string('thumbnail')
})
    .then(() => console.log('tabla creada'))
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
        mariaDbClient.destroy()
    });

const sqliteClient = knex(config.sqlite3);

await sqliteClient.schema.dropTableIfExists('mensajes')

sqliteClient.schema.createTable('mensajes', table => {
    table.increments('id')
    table.jsonb('author')
    table.string('text')
})
    .then(() => console.log('tabla creada'))
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
        sqliteClient.destroy()
    });