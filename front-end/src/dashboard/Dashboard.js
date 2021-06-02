import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { next, previous, today } from "../utils/date-time";
import ReservationTable from "./ReservationTable";
import RestaurantTable from "./RestaurantTable";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
                       reservations,
                       tables,
                       reservationsError,
                       tablesError,
                       date,
                       loadTables,
                       renderReservations,
                   }) {
    const history = useHistory();

    const handleDateChange = (newDate) => {
        history.push(`/dashboard?date=${newDate}`);
    };

    return (
        <main>
            <h1>Dashboard</h1>
            <div className={"dashboard"}>
                <div>
                    <h4>Reservations for {date}</h4>
                </div>
                <div>
                    <button onClick={() => handleDateChange(previous(date))} className="btn btn-primary dashboardButton">
                        Previous
                    </button>
                    <button onClick={() => handleDateChange(today())} className="btn btn-primary dashboardButton">
                        Today
                    </button>
                    <button onClick={() => handleDateChange(next(date))} className="btn btn-primary dashboardButton">
                        Next
                    </button>
                </div>
            </div>

            {/* Reservation Data */}
            <ErrorAlert error={reservationsError} />
            <ReservationTable reservations={reservations} renderReservations={renderReservations} />

            {/*Tables Data*/}
            <ErrorAlert error={tablesError} />
            <RestaurantTable
                tables={tables}
                loadTables={loadTables}
                renderReservations={renderReservations}
            />
        </main>
    );
}

export default Dashboard;