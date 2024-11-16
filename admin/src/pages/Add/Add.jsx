import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    basicSalary: "",
    category: "Owner",
    dob: "",
    nic: "",
    contactNo: "0"
  });

  const today = new Date();
  const max18YearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split("T")[0];
  const max30YearsAgo = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()).toISOString().split("T")[0];

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "name") {
      if (isValidName(value)) {
        setData((prevData) => ({ ...prevData, [name]: value }));
      } else {
        toast.error("Employee name cannot contain numbers or special characters.");
      }
    } else if (name === "description") {
      if (isValidName(value)) {
        setData((prevData) => ({ ...prevData, [name]: value }));
      } else {
        toast.error("Employee description cannot contain numbers or special characters.");
      }
    } else if (name === "contactNo") {
      // Validate that the contact number starts with '0' and is exactly 10 digits long
      if (!/^[0-9]{1,10}$/.test(value)) {
        toast.error("Contact number must be a valid number and up to 10 digits.");
        return;
      }
      if (value.length === 1 && value[0] !== '0') {
        toast.error("Contact number must start with 0.");
        return;
      }
      if (value.length >= 3) {
        const prefix = value.substring(0, 3);
        if (!['071', '074', '076', '078', '077', '075', '072','070'].includes(prefix)) {
          toast.error("Contact number must start with a valid Sri Lankan mobile prefix.");
          event.target.value = value.substring(0, 2); // Freeze the typing
          return;
        }
      }
      setData((prevData) => ({ ...prevData, [name]: value }));
    } else if (name === "nic") {
      // Allow only numbers and one 'v'/'V'
      if (/^[0-9]*[vV]?$/.test(value) && value.length <= 12) {
        setData((prevData) => ({ ...prevData, [name]: value }));
      } else {
        toast.error("NIC can only contain up to 12 characters: numbers and one 'v' or 'V'.");
      }
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Function to validate if input contains numbers or special characters
  const isValidName = (value) => {
    return /^[a-zA-Z\s]*$/.test(value); // Allows letters and spaces
  };

  const containsNumbers = (value) => {
    return /\d/.test(value); // Returns true if there are any digits in the input
  };

  // NIC Validation Function
  const validateNic = () => {
    const { nic } = data;
    const nicLength = nic.length;

    if (nicLength === 0) return; // Skip if NIC field is empty

    // Validate 10 character NIC (9 digits + 1 'v' or 'V')
    if (nicLength === 10) {
      const numericPart = nic.slice(0, 9);
      const letterPart = nic[9];

      if (!/^\d{9}$/.test(numericPart)) {
        toast.error("First 9 characters should be numbers for 10-character NIC.");
        return false;
      }

      if (letterPart !== 'v' && letterPart !== 'V') {
        toast.error("10th character must be 'v' or 'V' for 10-character NIC.");
        return false;
      }

      return true;
    }

    // Validate 12 character NIC (all digits)
    if (nicLength === 12) {
      if (!/^\d{12}$/.test(nic)) {
        toast.error("All characters should be numbers for 12-character NIC.");
        return false;
      }

      return true;
    }

    toast.error("NIC should be either 10 or 12 characters.");
    return false;
  };

  const onsubmitHandler = async (event) => {
    event.preventDefault();

    // Validate NIC before submission
    if (!validateNic()) {
      return;
    }

    const dobDate = new Date(data.dob);
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDifference = today.getMonth() - dobDate .getMonth();

    // Adjust the age if the current date is before the employee's birthdate this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    // Validate if the employee is at least 18 years old and under 60 years old
    if (age < 18) {
      toast.error("Employee must be at least 18 years old.");
      return;
    }
    if (age >= 60) {
      toast.error("Employee must be under 30 years old.");
      return;
    }

    // Validate employee description for numbers
    if (containsNumbers(data.description)) {
      toast.error("Employee description cannot contain numbers.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("basicSalary", Number(data.basicSalary));
    formData.append("category", data.category);
    formData.append("dob", data.dob);
    formData.append("nic", data.nic);
    formData.append("contactNo", data.contactNo);
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/employee/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          basicSalary: "",
          category: "Owner",
          dob: "",
          nic: "",
          contactNo: "0" // Reset contact number to default value
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error adding employee");
    }
  };

  const handleSalaryChange = (event) => {
    const { value } = event.target;

    // Allow empty input or valid positive integers
    if (value === '' || /^[0-9]*$/.test(value)) {
      setData((prevData) => ({ ...prevData, basicSalary: value }));
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onsubmitHandler}>
        <div className='add-img-upload'>
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt='' />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required />
        </div>

        <div className='add-employee-info'>
          <div className='add-employee-name'>
            <p>Employee Name</p>
            <input onChange={onChangeHandler} value={data.name} type='text' name='name' placeholder='Type here' required />
          </div>

          <div className='add-employee-description'>
            <p>Employee Description</p>
            <input onChange={onChangeHandler} value={data.description} type='text' name='description' placeholder='Type here' required />
          </div>
        </div>

        <div className='add-category-salary'>
          <div className='add-category'>
            <p>Employee Category</p>
            <select onChange={onChangeHandler} name='category'>
              <option value='Owner'>Owner</option>
              <option value='Excecutive Staff'>Excecutive Staff</option>
              <option value='Supporting Staff'>Supporting Staff</option>
            </select>
          </div>

          <div className='add-basicSalary'>
            <p>Basic Salary</p>
            <input
              onChange={handleSalaryChange}
              value={data.basicSalary}
              type='text'
              name='basicSalary'
              placeholder='LKR'
              required
            />
          </div>

          <div className="add-employee-dob">
            <p>Date of Birth</p>
            <input
              type="date"
              onChange={onChangeHandler}
              value={data.dob}
              name="dob"
              min={ max30YearsAgo} // Set minimum date to 30 years ago
              max={max18YearsAgo} // Set maximum date to 18 years ago
              required
              onClick={(e) => e.target.showPicker()} // Add this line
            />
          </div>
        </div>

        <div className='add-employee-contact'>
          <div className='add-nic'>
            <p>NIC</p>
            <input onChange={onChangeHandler} value={data.nic} type='text' name='nic' placeholder='Type Here' required />
          </div>

          <div className='add-contact'>
            <p>Mobile No</p>
            <input onChange={onChangeHandler} value={data.contactNo} type='text' name='contactNo' placeholder='07XXXXXXXX' maxLength="10 " required />
          </div>
        </div>

        <div className='add-employee-submit'>
          <button type='submit' className='btn-add'>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Add;