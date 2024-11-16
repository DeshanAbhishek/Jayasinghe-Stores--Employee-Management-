import React, { useContext, useState } from 'react';
import './Payroll.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Payroll = () => {
  const navigate = useNavigate();
  const { allemployee_list, payrollItem, removeFromPayroll, url } = useContext(StoreContext);

  // State to track overtime hours for each employee
  const [overtimeHours, setOvertimeHours] = useState({});
  const [allowance, setAllowance] = useState(null);
  const [managerName, setManagerName] = useState(''); // State to track manager name
  const [errorMessages, setErrorMessages] = useState({});

  const overtimeRate = 1.5;

  // Function to handle input change for overtime hours
  const handleOvertimeChange = (e, empId) => {
    const hours = parseFloat(e.target.value) || 0;
    if (hours < 0) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [empId]: 'OT hours cannot be negative',
      }));
      setOvertimeHours((prevHours) => ({
        ...prevHours,
        [empId]: 0,
      }));
    } else if (hours > 80) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [empId]: 'OT hours cannot exceed 80 hours',
      }));
      setOvertimeHours((prevHours) => ({
        ...prevHours,
        [empId]: 80,
      }));
    } else {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        [empId]: '',
      }));
      setOvertimeHours((prevHours) => ({
        ...prevHours,
        [empId]: hours,
      }));
    }
  };

  // Function to handle allowance input change
  const handleAllowanceChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setAllowance(null);
    } else if (!/^\d+$/.test(value)) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        allowance: 'Allowance can only contain numbers',
      }));
      setAllowance('');
    } else if (value.length > 5) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        allowance: 'Allowance cannot exceed LKR 99,999.00',
      }));
      setAllowance('');
    } else {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        allowance: '',
      }));
      setAllowance(value);
    }
  };

  // Function to handle manager name input change
  const handleManagerNameChange = (e) => {
    const value = e.target.value;
    if (!/^[a-zA-Z ]+$/.test(value)) {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        managerName: 'Manager name can only contain letters and spaces',
      }));
      setManagerName('');
    } else {
      setErrorMessages((prevMessages) => ({
        ...prevMessages,
        managerName: '',
      }));
      setManagerName(value);
    }
  };

  // Function to calculate the net salary for an employee
  const calculateNetSalary = (basicSalary, empId) => {
    const hours = overtimeHours[empId] || 0;
    const hourlyRate = basicSalary / 160;
    const overtimePay = hours * hourlyRate * overtimeRate;
    return basicSalary + overtimePay + (allowance !== null ? parseInt(allowance) : 0);
  };

  // Function to calculate the total salary for all employees
  const calculateTotalSalary = () => {
    let total = 0;
    allemployee_list.forEach((item) => {
      if (payrollItem[item._id] > 0) {
        const netSalary = calculateNetSalary(item.basicSalary, item._id);
        if (!isNaN(netSalary)) {
          total += netSalary;
        }
      }
    });
    return total;
  };

  // Pass data and navigate to the payment page
  const handleProceedToPayment = () => {
    const totalNetSalary = calculateTotalSalary();
    navigate('/payment', { state: { allowance, overtimeHours, totalNetSalary, managerName } });
  };

  return (
    <div className='payroll'>
      <div className='payroll-items'>
        <div className='payroll-items-title'>
          <p>Employees</p>
          <p>Title</p>
          <p>Basic Salary</p>
          <p>Description</p>
          <p>Over Time Hours</p>
          <p>Net Salary</p>
        </div>
        <br />
        <hr />
        {allemployee_list.map((item) => {
 if (payrollItem[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='payroll-items-title payroll-items-title'>
                  <img src={url + "/images/" + item.image} alt='' />
                  <p>{item.name}</p>
                  <p>LKR. {item.basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p>{item.description}</p>
                  <input
                    placeholder='Overtime Hours'
                    value={overtimeHours[item._id] || ''}
                    onChange={(e) => handleOvertimeChange(e, item._id)}
                  />
                  {errorMessages[item._id] && (
                    <p style={{ color: 'red' }}>{errorMessages[item._id]}</p>
                  )}
                  <p>LKR {calculateNetSalary(item.basicSalary, item._id).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <button onClick={() => removeFromPayroll(item._id)} className='cross'>Remove</button>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>

      <div className='payroll-bottom'>
        <div className='payroll-total'>
          <h2>Total Salary</h2>
          <div>
            <hr />
            <div className='payroll-total-details'>
              <p>Allowance</p>
              <input
                type='number'
                placeholder='Enter Allowance'
                value={allowance !== null ? allowance : ''}
                onChange={handleAllowanceChange}
                onKeyPress={(e) => {
                  if (e.key === '-' || e.key === '+' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
              {errorMessages.allowance && (
                <p style={{ color: 'red' }}>{errorMessages.allowance}</p>
              )}
            </div>
            <hr />
            <div className='payroll-total-details'>
              <b>Total</b>
              <b>LKR {isNaN(calculateTotalSalary()) ? '0.00' : calculateTotalSalary().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b>
            </div>
          </div>
          <button onClick={handleProceedToPayment}>PROCEED TO PAYMENT</button>
        </div>
        <div className='payroll-checkout'>
          <div>
            <p>Enter Name of the Check-out Manager</p>
            <input
              type='text'
              placeholder="Manager's name"
              required
              value={managerName} // Bind the input to managerName state
              onChange={handleManagerNameChange} // Update the state on input change
            />
            {errorMessages.managerName && (
              <p style={{ color: 'red' }}>{errorMessages.managerName}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;