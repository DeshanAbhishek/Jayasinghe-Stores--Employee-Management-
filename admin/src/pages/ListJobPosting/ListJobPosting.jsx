import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './ListJobPosting.css';

const EmployeeList = () => {
    const [jobPostings, setJobPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editJob, setEditJob] = useState(null);
    const [editDetails, setEditDetails] = useState({
        title: '',
        description: '',
        salary: '',
        location: '',
        category: '',
        deadline: new Date() // Default to today's date
    });
    const url = "http://localhost:4000"; // Your API base URL

    const fetchJobPostings = async () => {
        try {
            const response = await axios.get(`${url}/api/jobposting/list`);
            console.log(response.data); // Debugging line to check API response structure
            if (response.data.jobPostings) { // Check if jobPostings exist in the response
                setJobPostings(response.data.jobPostings);
            } else {
                setJobPostings([]); // Set to an empty array if the response doesn't contain jobPostings
            }
        } catch (error) {
            console.error("Error fetching job postings:", error.response?.data || error);
            toast.error("Error fetching job postings");
        } finally {
            setLoading(false);
        }
    };

    const removeJobPosting = async (jobId) => {
        try {
            const response = await axios.post(`${url}/api/jobposting/remove`, { id: jobId });
            if (response.data.success) {
                toast.success(response.data.message);
                fetchJobPostings();
            } else {
                toast.error("Error removing job posting");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Failed to remove job posting");
        }
    };

    const handleEditClick = (job) => {
        setEditJob(job);
        setEditDetails({
            title: job.title,
            description: job.description,
            salary: job.salary,
            location: job.location,
            category: job.category,
            deadline: new Date(job.deadline) // Store as Date object
        });
    };

    // Function to format salary
    const formatSalary = (salary) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(salary);
    };

    // Generalized onChange handler with validation for editing
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Validate input based on field name
        if (name === "title" || name === "description" || name === "location") {
            const regex = /^[A-Za-z\s]*$/; // Regex to match letters and spaces
            if (!regex.test(value) && value !== "") {
                toast.error(`${name.charAt(0).toUpperCase() + name.slice(1)} can only contain letters and spaces.`);
                return; // Prevent updating state if validation fails
            }
        }

        if (name === "salary") {
            const regex = /^[0-9]*$/; // Regex to match only numbers
            if (!regex.test(value) && value !== "") {
                toast.error("Salary can only contain numbers.");
                return; // Prevent updating state if validation fails
            }
            if (value < 0) {
                toast.error("Salary cannot be negative.");
                return; // Prevent updating state if value is negative
            }
        }

        if (name === "category") {
            const regex = /^[A-Za-z\s]*$/; // Regex to match letters and spaces
            if (!regex.test(value) && value !== "") {
                toast.error("Category can only contain letters and spaces.");
                return; // Prevent updating state if validation fails
            }
        }

        setEditDetails({
            ...editDetails,
            [name]: value,
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const updateData = { id: editJob._id, ...editDetails };

        try {
            const response = await axios.post(`${url}/api/jobposting/update`, updateData);
            if (response.data.success) {
                toast.success("Job posting updated successfully");
                setEditJob(null);
                fetchJobPostings();
            } else {
                toast.error("Error updating job posting");
            }
        } catch (error) {
            console.error("API Error:", error);
            toast.error("Failed to update job posting");
        }
    };

    useEffect(() => {
        fetchJobPostings();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Add loading state
    }

    return (
        <div className='job-posting-list'>
            <h2>Job Postings</h2>
            <div className='joblist-table'>
                <div className='joblist-table-format title'>
                    <div>Title</div>
                    <div>Description</div>
                    <div>Salary</div>
                    <div>Location</div>
                    <div>Category</div>
                    <div>Deadline</div>
                    <div>Action</div>
                </div>
                {jobPostings && jobPostings.length > 0 ? (
                    jobPostings.map((job) => (
                        <div key={job._id} className='joblist-table-format'>
                            <div>{job.title}</div>
                            <div>{job.description}</div>
                            <div>LKR {formatSalary(job.salary)}</div> {/* Format salary here */}
                            <div>{job.location}</div>
                            <div>{job.category}</div>
                            <div>{new Date(job.deadline).toLocaleDateString()}</div>
                            <div className='jobactions'>
                                <button onClick={() => handleEditClick(job)}>Edit</button>
                                <button onClick={() => removeJobPosting(job._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No job postings available.</p>
                )}
            </div>

            {editJob && (
                <div className='jobedit-form'>
                    <h3>Edit Job Posting</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input
                            type='text'
                            name='title'
                            value={editDetails.title}
                            onChange={handleInputChange}
                            placeholder='Job Title'
                            required
                        />
                        <input
                            type='text'
                            name='description'
                            value={editDetails.description}
                            onChange={handleInputChange}
                            placeholder='Description'
                            required
                        />
                        <input
                            type='text' // Change type to 'text' to handle custom validation
                            name='salary'
                            value={editDetails.salary}
                            onChange={handleInputChange}
                            placeholder='Salary'
                            required
                        />
                        <input
                            type='text'
                            name='location'
                            value={editDetails.location}
                            onChange={handleInputChange}
                            placeholder='Location'
                            required
                        />
                        <input
                            type='text'
                            name='category'
                            value={editDetails.category}
                            onChange={handleInputChange}
                            placeholder='Category'
                            required
                        />
                        <DatePicker
                            selected={editDetails.deadline}
                            onChange={(date) => setEditDetails({ ...editDetails, deadline: date })}
                            minDate={new Date()} // Disable past dates
                            className="date-picker" // Add your CSS styles for the date picker here
                        />
                        <div className='jobbutton-container'>
                            <button type='submit'>Update Job Posting</button>
                            <button type='button' onClick={() => setEditJob(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
