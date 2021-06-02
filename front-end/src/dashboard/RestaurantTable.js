import React from "react";
import { updateTable } from "../utils/api";
import RestaurantTableRow from "./RestaurantTableRow";

function RestaurantTable({ tables, loadTables, renderReservations }){
    async function onRestoreTableHandler(table_id, reservation_id){
        const proceedWithRemoval = window.confirm("Is this table ready to seat new guests? This cannot be undone.");

        if (proceedWithRemoval) {
            await updateTable(table_id);
            await loadTables();
            await renderReservations();
        }
    };

    return (
        <div>
            <div className={"dashboard"}>
                <h4>Tables</h4>
            </div>

            <table className="table w-100">
                <thead>
                <tr>
                    <th>Table ID</th>
                    <th>Table Name</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Finish</th>
                </tr>
                </thead>
                <tbody>
                {tables.map((table, index) => (
                    <RestaurantTableRow key={index} table={table} onRestoreTableHandler={onRestoreTableHandler} />
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default RestaurantTable;