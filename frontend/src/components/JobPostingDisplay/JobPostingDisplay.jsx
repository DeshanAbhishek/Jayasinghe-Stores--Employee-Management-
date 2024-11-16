import React, { useContext } from 'react';
import './JobPostingDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import JobPostingItem from '../JobPostingItem/JobPostingItem';

const JobPostingDisplay = ({ searchQuery }) => {
  const { alljobposting_list } = useContext(StoreContext);

  const filteredJobPostings = alljobposting_list.filter((jobPosting) => {
    const jobTitle = jobPosting.title.toLowerCase();
    const jobDescription = jobPosting.description.toLowerCase();
    const searchQueryLower = searchQuery.toLowerCase();
    return (
      jobTitle.includes(searchQueryLower) ||
      jobDescription.includes(searchQueryLower)
    );
  });

  return (
    <div className="job-posting-display">
      <h2>Available Job Postings</h2>
      <div className="job-posting-list">
        {filteredJobPostings.length > 0 ? (
          filteredJobPostings.map((job, index) => (
            <JobPostingItem
              key={index}
              id={job._id}
              title={job.title}
              description={job.description}
              salary={job.salary}
              location={job.location}
              category={job.category}
              deadline={job.deadline}
            />
          ))
        ) : (
          <p>No job postings available.</p>
        )}
      </div>
    </div>
  );
};

export default JobPostingDisplay;