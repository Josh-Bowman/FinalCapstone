import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import formatReservationDate from "../utils/format-reservation-date";
import {getReservationById,seatReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservationForm({tables,loadTables, renderReservations}){
    const { reservation_id } = useParams();
    const [error, setError] = useState(null);
    const [reservation, setReservation] = useState(null);
    const [formErrors, setFormErrors] = useState([]);
    const [tableId, setTableId] = useState(0);
    const history = useHistory();

    useEffect(loadReservation, [reservation_id]);

    function loadReservation(){
        const abortController = new AbortController();
        setError(null);
        getReservationById(reservation_id, abortController.signal).then(setReservation).catch(setError);
        return () => abortController.abort();
    }

    function onChangeHandler(event){
        setTableId(event.target.value);
    }

    function checkForm(){
        const errors = [];
        let isValid = true;

        const table = tables.find((table) => table.table_id === Number(tableId));
        if (table.reservation_id) {
            errors.push({
                message: "Table is taken",
            });
            isValid = false;
        }
        if (reservation.people > table.capacity) {
            errors.push({
                message: "Party is exceeding seat capacity.",
            });

            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    }

    async function onCreateHandler(event){
        event.preventDefault();

        if (checkForm()) {
            try {
                await seatReservation(tableId, { data: { reservation_id } });
                await loadTables();
                await renderReservations();
                formatReservationDate(reservation);
                history.push(`/dashboard?date=${reservation.reservation_date}`);
            } catch (error) {
                setError(error);
            }
        }
    }

    return (
        <div>
            <h2 className="mt-3 mb-5">Seat Reservation</h2>

            {formErrors.map((valError, index) => (
                <ErrorAlert key={index} error={valError} />
            ))}

            <form onSubmit={onCreateHandler} className="w-50">
                <div className="form-group row">
                    <label htmlFor="table_id" className="col-sm-2 col-form-label">
                        Table number
                    </label>
                    <div className="col-sm-10">
                        <select
                            className="form-select"
                            id="table_id"
                            name="table_id"
                            onChange={onChangeHandler}
                            value={tableId}
                        >
                            <option defaultValue={0}>Select table</option>
                            {tables.map((table) => (
                                <option key={table.table_id} value={table.table_id}>
                                    {`${table.table_name} - ${table.capacity}`}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group col mt-5 p-0">
                    <button className="btn btn-danger mr-2" onClick={()=> history.goBack()}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
            <ErrorAlert error={error} />
        </div>
    );
};

export default SeatReservationForm;