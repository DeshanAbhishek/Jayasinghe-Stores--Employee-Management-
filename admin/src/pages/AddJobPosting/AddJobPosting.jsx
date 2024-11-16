import React, { useState } from 'react';
import './AddJobPosting.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddJobPosting = ({ url }) => {
    const [data, setData] = useState({
        title: "",
        description: "",
        salary: "",
        category: "General",
        location: "",
        closingDate: "",
    });

    // Generalized onChange handler with validation
    const onChangeHandler = (event) => {
        const { name, value } = event.target;

        // Validate input based on field name
        if (name === "title" || name === "description" || name === "location") {
            // Only allow letters and spaces for title, description, and location
            const regex = /^[A-Za-z\s]*$/; // Regex to match letters and spaces
            if (!regex.test(value) && value !== "") {
                toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} can only contain letters and spaces.`);
                return; // Prevent updating state if validation fails
            }
        }

        if (name === "salary") {
            // Only allow numbers for salary
            const regex = /^[0-9]*$/; // Regex to match only numbers
            // Prevent input if it includes any non-numeric character including 'e'
            if (!regex.test(value) && value !== "") {
                toast.error("Salary can only contain numbers.");
                return; // Prevent updating state if validation fails
            }
        }

        // Update the state only if the value is valid
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Improved onSubmit handler with async/await
    const onsubmitHandler = async (event) => {
        event.preventDefault();

        const closingDate = new Date(data.closingDate);
        if (closingDate <= new Date()) {
            toast.error("Closing date must be in the future.");
            return;
        }

        const jobData = { ...data, deadline: closingDate };

        try {
            const response = await axios.post(`${url}/api/jobposting/add`, jobData);
            if (response.data.success) {
                setData({
                    title: "",
                    description: "",
                    salary: "",
                    category: "General",
                    location: "",
                    closingDate: "",
                });
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error during API call:", error);
            toast.error("Error adding job posting");
        }
    };

    // Get today's date in YYYY-MM-DD format for min attribute
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='add-job-posting'>
            <form className='flex-col' onSubmit={onsubmitHandler}>
                {/** Using map to dynamically generate form fields */}
                {[
                    { label: "Job Title", name: "title", type: "text", required: true },
                    { label: "Job Description", name: "description", type: "textarea", required: true },
                    { label: "Salary", name: "salary", type: "text", required: true },  
                    { label: "Location", name: "location", type: "text", required: true },
                ].map(({ label, name, type, required }) => (
                    <div key={name} className={`add-job-${name}`}>
                        <p>{label}</p>
                        {type === "textarea" ? (
                            <textarea onChange={onChangeHandler} value={data[name]} name={name} placeholder={`Enter ${label.toLowerCase()}`} required={required} />
                        ) : (
                            <input
                                onChange={onChangeHandler}
                                value={data[name]}
                                type={type}
                                name={name}
                                placeholder={`Enter ${label.toLowerCase()}`}
                                required={required}
                            />
                        )}
                    </div>
                ))}

                <div className='add-job-category'>
                    <p>Job Category</p>
                    <select onChange={onChangeHandler} name='category'>
                        <option value='General'>Owner</option>
                        <option value='Technical'>Executive Staff</option>
                        <option value='Management'>Supporting Staff</option>
                    </select>
                </div>

                <div className='add-job-closing-date'>
                    <p>Closing Date</p>
                    <input
                        type="date"
                        onChange={onChangeHandler}
                        value={data.closingDate}
                        name="closingDate"
                        required
                        min={today} // Prevent past dates
                        onClick={(e) => e.target.showPicker()} // Trigger calendar on click
                    />
                </div>

                <button type='submit' className='add-btn'>POST JOB</button>
            </form>
        </div>
    );
};

export default AddJobPosting;
