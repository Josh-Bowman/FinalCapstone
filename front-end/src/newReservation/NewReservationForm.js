import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { createReservation, getReservationById, updateReservation } from "../utils/api";
import formatReservationDate from "../utils/format-reservation-date";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservationForm({ loadReservations, date, renderReservations }){
    const { reservation_id } = useParams();
    const history = useHistory();
    const defaultFormData = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
    };
    const [formData, setFormData] = useState({ ...defaultFormData });
    const [error, setError] = useState(null);
    const [formErrors, setValidationErrors] = useState([]);

    function checkForm (){
        const errors = [];
        let validFlag = true;
        const todayDate = new Date();
        const date = new Date(`${formData.reservation_date}T${formData.reservation_time}:00`);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        if (date.getDay() === 2) {
            errors.push({
                message: "Closed on a Tuesday.",
            });
            validFlag = false;
        }

        if (date < todayDate) {
            errors.push({
                message: "Can't place a reservation in the past dates.",
            });
            validFlag = false;
        }

        if (hours < 10 || (hours === 10 && minutes < 30)) {
            errors.push({
                message: "Opens at 10:30am: Can't place reservation before opening.",
            });
            validFlag = false;
        }

        if ((hours === 21 && minutes > 30) || (hours === 22 && minutes < 30)) {
            errors.push({
                message: "Any time after 9:30 PM is too late for a reservation.",
            });
            validFlag = false;
        }

        if (hours > 22 || (hours === 22 && minutes >= 30)) {
            errors.push({
                message: "Restaurant closes at 10:30 PM.",
            });
            validFlag = false;
        }
        setValidationErrors(errors);
        return validFlag;
    }

    function onChangeHandler(event){
        const value = event.target.name === "people" ? Number(event.target.value) : event.target.value;

        setFormData((currentFormData) => {
            return {
                ...currentFormData,
                [event.target.name]: value,
            };
        });
    }

    async function onCreateHandler(event){
        event.preventDefault();
        if (checkForm()) {
            try {
                if (reservation_id) {
                    const updatedReservation = await updateReservation(reservation_id, {
                        data: { ...formData, status: "booked" },
                    });
                    await renderReservations();
                    formatReservationDate(updatedReservation);
                    history.push(`/dashboard?date=${updatedReservation.reservation_date}`);
                } else {
                    const createdReservation = await createReservation({
                        data: { ...formData, status: "booked" },
                    });
                    formatReservationDate(createdReservation);
                    if (createdReservation.reservation_date === date) {
                        loadReservations();
                    }
                    history.push(`/dashboard?date=${createdReservation.reservation_date}`);
                }
            } catch (error) {
                setError(error);
            }
        }
    }

    useEffect(() => {
        if (reservation_id) {
            getReservationById(reservation_id)
                .then((reservation) => {
                    formatReservationDate(reservation);
                    setFormData({
                        first_name: reservation.first_name,
                        last_name: reservation.last_name,
                        mobile_number: reservation.mobile_number,
                        reservation_date: reservation.reservation_date,
                        reservation_time: reservation.reservation_time,
                        people: reservation.people,
                    });
                })
                .catch(setError);
        } else {
            setFormData({
                first_name: "",
                last_name: "",
                mobile_number: "",
                reservation_date: "",
                reservation_time: "",
                people: 0,
            });
        }
    }, [reservation_id]);


    return (
        <div>
            <h2 className="mt-3 mb-5">{reservation_id ? "Edit" : "Create"} Reservation</h2>
            {formErrors.map((valError, index) => (
                <ErrorAlert key={index} error={valError} />
            ))}
            <form onSubmit={onCreateHandler} className="w-50">
                <div className="form-group row">
                    <label htmlFor="first_name" className="col-sm-2 col-form-label">
                        First Name
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            name="first_name"
                            onChange={onChangeHandler}
                            value={formData.first_name}
                            required
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="last_name" className="col-sm-2 col-form-label">
                        Last Name
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="last_name"
                            name="last_name"
                            onChange={onChangeHandler}
                            value={formData.last_name}
                            required
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="reservation_date" className="col-sm-2 col-form-label">
                        Reservation Date
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="date"
                            className="form-control"
                            id="reservation_date"
                            name="reservation_date"
                            onChange={onChangeHandler}
                            value={formData.reservation_date}
                            required
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="reservation_time" className="col-sm-2 col-form-label">
                        Reservation Time
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="time"
                            className="form-control"
                            id="reservation_time"
                            name="reservation_time"
                            onChange={onChangeHandler}
                            value={formData.reservation_time}
                            required
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="people" className="col-sm-2 col-form-label">
                        People
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="number"
                            className="form-control"
                            id="people"
                            name="people"
                            onChange={onChangeHandler}
                            value={formData.people}
                            min={1}
                            required
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="mobile_number" className="col-sm-2 col-form-label">
                        Mobile #
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="tel"
                            className="form-control"
                            id="mobile_number"
                            name="mobile_number"
                            onChange={onChangeHandler}
                            placeholder="555-555-5555"
                            value={formData.mobile_number}
                            required
                        />
                    </div>
                </div>
                <div className="form-group col mt-5 p-0">
                    <button className="btn btn-secondary mr-2" onClick={() => history.goBack()}>
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
}

export default NewReservationForm;