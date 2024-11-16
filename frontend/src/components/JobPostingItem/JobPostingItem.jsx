import React from 'react';
import './JobPostingItem.css';

const JobPostingItem = ({ id, title, description, salary, location, category, deadline }) => {
  return (
    <div className="job-posting-item">
      <h3>{title}</h3>
      <p><strong>Description: </strong>{description}</p>
      <p><strong>Basic Salary: </strong>LKR {salary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p><strong>Location: </strong>{location}</p>
      <p><strong>Category: </strong>{category}</p>
      <p><strong>Closing Date: </strong>{new Date(deadline).toLocaleDateString()}</p>
    </div>
  );
};

export default JobPostingItem;