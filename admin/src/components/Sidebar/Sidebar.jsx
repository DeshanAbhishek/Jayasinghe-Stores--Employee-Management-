import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-options'>
        <NavLink to='/add' className='sidebar-option'>
          <img src={assets.add_icon} alt='' />
          <p>Add Employee</p>
        </NavLink>
        <NavLink to='/list' className='sidebar-option'>
          <img src={assets.order_icon} alt='' />
          <p>List Employee</p>
        </NavLink>
        <NavLink to='/job-postings' className='sidebar-option'> {/* Fixed path here */}
          <img src={assets.add_icon} alt='' />
          <p>Job Posting</p>
        </NavLink>
        <NavLink to='/list-job-postings' className='sidebar-option'> {/* Fixed path here */}
          <img src={assets.order_icon} alt='' />
          <p>List Job Posting</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
