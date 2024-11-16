import React, { useContext } from 'react';
import './EmployeeItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const EmployeeItem = ({ id, name, description, image, category }) => {
  const { payrollItem, addToPayroll, removeFromPayroll, url } = useContext(StoreContext);

  const handleAddToPayroll = () => {
    addToPayroll(id);
  };

  return (
    <div className='employee-item'>
      <div className='employee-item-img-container'>
        <img
          className='employee-item-image'
          src={url + "/images/" + image}
          alt=''
          onClick={handleAddToPayroll}
        />
        {!payrollItem[id] ? (
          <button className='add-to-payroll-btn' onClick={handleAddToPayroll}>
            Add to Payroll
          </button>
        ) : (
          <div className='employee-item-counter'>
            <img onClick={() => removeFromPayroll(id)} src={assets.remove_icon_red} alt='' />
            <p>{payrollItem[id]}</p>
            <img onClick={() => addToPayroll(id)} src={assets.add_icon_green} alt='' />
          </div>
        )}
      </div>
      <div className='employee-item-info'>
        <div className='employee-item-name-rating'>
          <p>{name}</p>
        </div>
        <p>{category}</p>
        <p className='employee-item-desc'>{description}</p>
      </div>
    </div>
  );
};

export default EmployeeItem;