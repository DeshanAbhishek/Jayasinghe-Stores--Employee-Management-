import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreEmployee from '../../components/ExploreEmployee/ExploreEmployee';
import EmployeeDisplay from '../../components/EmployeeDisplay/EmployeeDisplay';
import JobPostingDisplay from '../../components/JobPostingDisplay/JobPostingDisplay';

const Home = () => {
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Header />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search employees or job postings"
      />
      <ExploreEmployee category={category} setCategory={setCategory} />
      
      <EmployeeDisplay category={category} searchQuery={searchQuery} />
      <JobPostingDisplay searchQuery={searchQuery} />
    </div>
  );
};

export default Home;