const knex = require("../db/connection");

const tableName = "reservations";

function list(reservation_date) {
    if(reservation_date) {
        return knex(tableName)
            .select("*")
            .where({ reservation_date })
            .orderBy("reservation_time", "asc")
            .then((reservations) => reservations.filter((reservation) => reservation.status !== "finished")
            );
    } else {
        return knex(tableName)
            .select("*")
            .orderBy("reservation_time", "asc")
            .then((reservations) => reservations.filter((reservation) => reservation.status !== "finished")
            );
    }
}

function create(reservation) {
    return knex(tableName)
        .insert(reservation, "*")
        .then((reservations) => reservations[0]);
}

function read(reservation_id){
    return knex(tableName)
        .where({ reservation_id })
        .first();
}

function updateReservationAfterTableReset(reservation_id, status){
    return knex(tableName)
        .where({ reservation_id })
        .update({ status }, "*")
        .then((reservations) => reservations[0]);
}

function phoneLookup(mobile_number) {
    return knex(tableName)
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

function update(reservation_id, updateData) {
    return knex(tableName)
        .update(updateData, "*")
        .where({ reservation_id })
        .then((reservations) => reservations[0]);
}

module.exports = {
    list,
    create,
    read,
    updateReservationAfterTableReset: updateReservationAfterTableReset,
    phoneLookup,
    update,
}