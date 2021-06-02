import React from "react";
import { updateReservationStatus } from "../utils/api";
import ReservationTableRow from "./ReservationTableRow";

function ReservationTable({ reservations, renderReservations }){
    const notFinishedReservations = reservations.filter(
        (reservation) => reservation.status !== "finished"
    );

    async function onCancelHandler(reservation_id){
        const proceedWithCancel = window.confirm("Do you want to cancel this reservation? This cannot be undone.");
        if (proceedWithCancel) {
            await updateReservationStatus(reservation_id, "cancelled");
            await renderReservations();
        }
    }

    return (
        <table className="table">
            <thead>
            <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>People</th>
                <th>Mobile #</th>
                <th>Status</th>
                <th>Seat</th>
                <th>Edit</th>
                <th>Cancel</th>
            </tr>
            </thead>
            <tbody>
            {notFinishedReservations.map((reservation, index) => (
                <ReservationTableRow
                    key={reservation.reservation_id}
                    reservation={reservation}
                    onCancel={onCancelHandler}
                />
            ))}
            </tbody>
        </table>
    );
}

export default ReservationTable;