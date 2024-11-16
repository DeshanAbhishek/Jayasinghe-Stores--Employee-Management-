import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './List.css';

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [editEmployee, setEditEmployee] = useState(null);
  const [editDetails, setEditDetails] = useState({
    name: '',
    description: '',
    basicSalary: '',
    category: 'Owner',
    dob: '',
    nic: '',
    contactNo: ''
  });

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/employee/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching employee list");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch data");
    }
  };

  const removeEmployee = async (employeeId) => {
    try {
      const response = await axios.post(`${url}/api/employee/remove`, { id: employeeId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error removing employee");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to remove employee");
    }
  };

  const handleEditClick = (employee) => {
    setEditEmployee(employee);
    setEditDetails({
      name: employee.name,
      description: employee.description,
      basicSalary: employee.basicSalary,
      category: employee.category,
      dob: employee.dob.split('T')[0],
      nic: employee.nic,
      contactNo: employee.contactNo
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate for letters only (no numbers or special characters) for Name and Description
    const regex = /^[A-Za-z\s]*$/;
    if (name === 'name' || name === 'description') {
      if (regex.test(value) || value === '') {
        setEditDetails({
          ...editDetails,
          [name]: value,
        });
      } else {
        toast.error("Only letters and spaces are allowed.");
      }
    } else if (name === 'basicSalary') {
      const salaryRegex = /^[0-9]*(\.[0-9]+)?$/;
      if (salaryRegex.test(value) || value === '') {
        setEditDetails({
          ...editDetails,
          [name]: value,
        });
      } else {
        toast.error("Please enter a valid positive salary value.");
      }
    } else if (name === 'nic') {
      const validNIC = /^[0-9]*$/;
      if (validNIC.test(value) || value === '') {
        setEditDetails({
          ...editDetails,
          [name]: value,
        });
      }
      if (value.length > 0 && value.length <= 11 && (value.endsWith('v') || value.endsWith('V'))) {
        setEditDetails({
          ...editDetails,
          [name]: value,
        });
      }
      if (value.length === 12 && (value.endsWith('V') || value.endsWith('v'))) {
        setEditDetails({
          ...editDetails,
          [name]: value,
        });
      }
    } else if (name === 'contactNo') {
      const contactRegex = /^[0-9]*$/; // Only allow numbers
      if (contactRegex.test(value) && value.length < 10) { // Limit to 10 digits
        setEditDetails({
          ...editDetails,
          [name]: value,
        });
      }
    } else {
      setEditDetails({
        ...editDetails,
        [name]: value,
      });
    }
  };

  const validateNIC = (nic) => {
    const regex = /^[0-9]{9}[vVxX]$/; 
    const regexNew = /^[0-9]{12}$/; 
    return (regex.test(nic) || regexNew.test(nic)) && nic.length <= 12;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateNIC(editDetails.nic)) {
      toast.error("Invalid NIC format. Please enter a valid NIC (max 12 characters).");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/employee/update`, {
        id: editEmployee._id,
        name: editDetails.name,
        description: editDetails.description,
        basicSalary: editDetails.basicSalary,
        category: editDetails.category,
        dob: editDetails.dob,
        nic: editDetails.nic,
        contactNo: editDetails.contactNo
      });
      if (response.data.success) {
        toast.success("Employee updated successfully");
        setEditEmployee(null);
        fetchList();
      } else {
        toast.error("Error updating employee");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to update employee");
    }
  };

  const formatSalary = (salary) => {
    return Number(salary).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getMinMaxDOB = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 30); // Max age 30
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 18); // Min age 18

    return {
      min: minDate.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0],
    };
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <h2>All Employee List</h2>
      <div className='list-table'>
        <div className='list-table-format title'>
          <div>Image</div>
          <div>Name</div>
          <div>Description</div>
          <div>Basic Salary</div>
          <div>Category</div>
          <div>DOB</div>
          <div>NIC</div>
          <div>CONTACT</div>
          <div>Action</div>
        </div>
        {list.length > 0 ? (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img
                src={item.image ? `${url}/images/${item.image}` : `${url}/images/default.png`}
                alt={item.name}
                onError={(e) => (e.target.src = `${url}/images/default.png`)}
              />
              <div>{item.name}</div>
              <div>{item.description}</div>
              <div>LKR. {formatSalary(item.basicSalary)}</div>
              <div>{item.category}</div>
              <div>{new Date(item.dob).toLocaleDateString('en-CA')}</div>
              <div>{item.nic}</div>
              <div>{item.contactNo}</div>
              <div className='actions'>
                <button onClick={() => handleEditClick(item)}>Edit</button>
                <button onClick={() => removeEmployee(item._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No employees found</p>
        )}
      </div>

      {editEmployee && (
        <div className='edit-form'>
          <h3>Edit Employee</h3>
          <form onSubmit={handleEditSubmit}>
            <input
              type='text'
              name='name'
              value={editDetails.name}
              onChange={handleInputChange}
              placeholder='Name'
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
              type='text'
              name='basicSalary'
              value={editDetails.basicSalary}
              onChange={handleInputChange}
              placeholder='Basic Salary'
              required
            />
            <select
              name='category'
              value={editDetails.category}
              onChange={handleInputChange}
              required
            >
              <option value='Owner'>Owner</option>
              <option value='Excecutive Staff'>Excecutive Staff</option>
              <option value='Supporting Staff'>Supporting Staff</option>
            </select>
            <input
              type='date'
              name='dob'
              value={editDetails.dob}
              onChange={handleInputChange}
              onFocus={(e) => e.target.showPicker()} // Show date picker on focus
              min={getMinMaxDOB().min}
              max={getMinMaxDOB().max}
              required
            />
            <input
              type='text'
              name='nic'
              value={editDetails.nic}
              onChange={handleInputChange}
              placeholder='NIC'
              required
            />
            <input
              type='text'
              name='contactNo'
              value={editDetails.contactNo}
              onChange={handleInputChange}
              placeholder='Contact Number'
              maxLength={10} // Limit to 10 digits
              required
            />
            <button className='button-container' type='submit'>Update Employee</button>
            <button className='button-container' type='button' onClick={() => setEditEmployee(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default List;
