import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function NewTableForm({ loadTables }){
    const [error, setError] = useState(null);
    const [formErrors, setFormErrors] = useState([]);
    const defaultFormData = {
        table_name: "",
        capacity: "",
    };
    const [formData, setFormData] = useState({ ...defaultFormData });
    const history = useHistory();

    function checkForm(){
        const errors = [];
        let validFlag = true;

        if (formData.table_name === "") {
            errors.push({
                message: "Table Name cannot be left empty.",
            });
            validFlag = false;
        }

        if (formData.table_name.length < 2) {
            errors.push({
                message: "Table Name must be atleast 2 characters long.",
            });
            validFlag = false;
        }

        if (formData.capacity === "") {
            errors.push({
                message: "Capacity must not be left empty.",
            });
            validFlag = false;
        } else if (isNaN(formData.capacity)) {
            errors.push({
                message: "Capacity must be a number.",
            });
            validFlag = false;
        } else {
            if (Number(formData.capacity) < 1) {
                errors.push({
                    message: "Capacity must be at least 1.",
                });
                validFlag = false;
            }
        }
        setFormErrors(errors);
        return validFlag;
    }

    async function onCreateHandler(event){
        event.preventDefault();
        if (checkForm()) {
            try {
                await createTable({ data: { ...formData } });
                loadTables();
                history.push("/dashboard");
            } catch (error) {
                setError(error);
            }
        }
    }

    function onChangeHandler(event){
        setFormData((currentFormData) => {
            return {
                ...currentFormData,
                [event.target.name]: event.target.value,
            };
        });
    }

    return (
        <div>
            <h2 className="mt-3 mb-5">Create Table</h2>

            {formErrors.map((valError, index) => (
                <ErrorAlert key={index} error={valError} />
            ))}

            <form onSubmit={onCreateHandler} className="w-50">
                <div className="form-group row">
                    <label htmlFor="table_name" className="col-sm-2 col-form-label">
                        Table Name
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="table_name"
                            name="table_name"
                            onChange={onChangeHandler}
                            value={formData.table_name}
                        />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="capacity" className="col-sm-2 col-form-label">
                        Capacity
                    </label>
                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="capacity"
                            name="capacity"
                            onChange={onChangeHandler}
                            value={formData.capacity}
                        />
                    </div>
                </div>
                <div className="form-group col mt-5 p-0">
                    <button className="btn btn-secondary mr-2" onClick={()=> history.goBack()}>
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

export default NewTableForm;