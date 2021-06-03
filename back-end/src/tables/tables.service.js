const knex = require("../db/connection");

const tableName = "tables";

function list() {
	return knex(tableName)
		.select("*")
        .orderBy("table_name", "asc");
}

function create(table) {
	return knex(tableName)
		.insert(table)
		.returning("*")
        .then((createdTable) => createdTable[0]);
}

function read(table_id) {
    return knex(tableName)
        .where({ table_id })
        .returning("*")
        .then((createdTable) => createdTable[0]);
}


function update(updatedTable) {
    return knex(tableName)
        .where({ table_id: updatedTable.table_id })
        .update(updatedTable, "*")
}

function free(table_id) {
    return knex(tableName)
        .update({ reservation_id: null, status: "free" })
        .where({ table_id: table_id })
}

module.exports = {
	list,
	create,
    read,
    update,
    free, // DELETE
}