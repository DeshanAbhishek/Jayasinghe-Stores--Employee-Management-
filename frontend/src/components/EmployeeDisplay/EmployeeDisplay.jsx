import React, { useContext } from 'react';
import './EmployeeDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import EmployeeItem from '../EmployeeItem/EmployeeItem';

const EmployeeDisplay = ({ category, searchQuery }) => {
  const { allemployee_list } = useContext(StoreContext);

  const filteredEmployees = allemployee_list.filter((employee) => {
    return category === "All" || employee.category === category;
  });

  const searchFilteredEmployees = filteredEmployees.filter((employee) => {
    const employeeName = employee.name.toLowerCase();
    const employeeDesignation = employee.description.toLowerCase();
    const searchQueryLower = searchQuery.toLowerCase();
    return (
      employeeName.includes(searchQueryLower) ||
      employeeDesignation.includes(searchQueryLower)
    );
  });

  return (
    <div className='employee-display' id='employee-display'>
      <h2>{category === "All" ? "All Employees Near You" : `${category} Employees Near You`}</h2>
      <div className='employee-display-list'>
        {searchFilteredEmployees.map((item, index) => {
          return (
            <EmployeeItem
              key={index}
              id={item._id}
              name={item.name}
              category={item.category}
              description={item.description}
              image={item.image}
            />
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeDisplay;