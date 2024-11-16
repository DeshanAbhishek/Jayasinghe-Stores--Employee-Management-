import React from 'react';
import './ExploreEmployee.css';
import { employee_list } from '../../assets/assets';

const ExploreEmployee = ({ category, setCategory }) => {
  return (
    <div className='explore-employee' id='explore-employee'>
      <h1>Explore Our Weight</h1>
      <p className='explore-employee-text'>
        Your partner in people success—nurturing talent, driving engagement, and creating a
        workplace where everyone thrives together, every day
      </p>
      <div className='explore-employee-list'>
        {employee_list.map((item, index) => {
          return (
            <div
              onClick={() => setCategory(item.employee_name)}
              key={index}
              className='explore-employee-list-item'
            >
              <img
                className={category === item.employee_name ? "active" : ""}
                src={item.employee_image}
                alt=""
              />
              <p>{item.employee_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreEmployee;