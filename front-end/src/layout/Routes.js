import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservationForm from "../newReservation/NewReservationForm";
import NewTableForm from "../newTable/NewTableForm";
import SeatReservationForm from "../seatReservation/SeatReservationForm";
import { listReservations, listTables } from "../utils/api";
import SearchReservationsForm from "../search/SearchReservationsForm";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);
    const urlDate = new URLSearchParams(useLocation().search).get("date");
    let date = "";
    if(urlDate){
        date = urlDate;
    } else {
        date = today();
    }

    useEffect(loadTables, []);
    useEffect(loadReservations, [date]);

    function loadReservations() {
        const abortController = new AbortController();
        setReservationsError(null);
        listReservations({ date }, abortController.signal)
            .then(setReservations)
            .catch(setReservationsError);
        return () => abortController.abort();
    }
    function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        return listTables(abortController.signal).then(setTables).catch(setTablesError);
    }
    function renderReservations() {
        setReservationsError(null);
        return listReservations({ date }).then(setReservations).catch(setReservationsError);
    }

    return (
        <Switch>
            <Route exact={true} path="/">
                <Redirect to={"/dashboard"} />
            </Route>
            <Route exact={true} path="/reservations">
                <Redirect to={"/dashboard"} />
            </Route>
            <Route path="/dashboard">
                <Dashboard
                    reservations={reservations}
                    tables={tables}
                    reservationsError={reservationsError}
                    tablesError={tablesError}
                    date={date}
                    loadTables={loadTables}
                    renderReservations={renderReservations}
                />
            </Route>
            <Route path="/reservations/:reservation_id/seat">
                <SeatReservationForm
                    reservations={reservations}
                    tables={tables}
                    loadTables={loadTables}
                    renderReservations={renderReservations}
                />
            </Route>
            <Route path="/reservations/:reservation_id/edit">
                <NewReservationForm
                    loadReservations={loadReservations}
                    date={date}
                    renderReservations={renderReservations}
                />
            </Route>
            <Route path="/reservations/new">
                <NewReservationForm loadReservations={loadReservations} date={date} />
            </Route>
            <Route path="/tables/new">
                <NewTableForm loadTables={loadTables} />
            </Route>
            <Route path="/search">
                <SearchReservationsForm />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}

export default Routes;