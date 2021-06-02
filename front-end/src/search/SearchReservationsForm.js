import React, { useState } from "react";
import ReservationTable from "../dashboard/ReservationTable";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";

function SearchReservationsForm(){
    const [mobileNumber, setMobileNumber] = useState("");
    const [error, setError] = useState(null);
    const [foundReservations, setFoundReservations] = useState([]);

    function onChangeHandler(event){
        setMobileNumber(event.target.value);
    }

    function onSubmitHandler(event){
        event.preventDefault();
        setError(null);
        listReservations({ mobile_number: mobileNumber })
            .then((results) => {
                setFoundReservations([...results]);
            })
            .catch(setError);
    }

    return (
        <div>
            <h1>Search</h1>
           <div className={"dashboard"}>
               <h4 className="mb-0">Search Results</h4>
               <form className={"searchForm"}>
                   <div className="input-group">
                       <input
                           className="form-control col-9"
                           type="text"
                           name="mobile_number"
                           id="mobile_number"
                           placeholder="Enter a phone number"
                           onChange={onChangeHandler}
                           value={mobileNumber}
                       />
                       <button type="submit" className="btn btn-primary" onClick={onSubmitHandler}>
                           Find
                       </button>
                   </div>
               </form>
           </div>

            <ErrorAlert error={error} />
            <ReservationTable reservations={foundReservations} />
            {foundReservations.length === 0 ? <h6>No reservations found</h6> : null}
        </div>
    );
}

export default SearchReservationsForm;