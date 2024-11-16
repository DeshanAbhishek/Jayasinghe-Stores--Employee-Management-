import React, { useState } from 'react';
import './PlacePayment.css';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import jsPDF autotable for table support
import { assets } from '../../assets/assets'; // Update with your logo path

const PlacePayment = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { allowance, overtimeHours, totalNetSalary, managerName } = location.state || {}; // Destructure managerName

  // State to capture form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    managerName: managerName || '', // Set managerName to initial value
  });

  // State to store error messages
  const [errorMessages, setErrorMessages] = useState({});

  // Regex pattern for name validation (only letters and spaces allowed)
  const namePattern = /^[a-zA-Z ]+$/;

  // Regex pattern for email validation (only letters, must contain @, and a valid domain)
  const emailPattern = /^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'firstName' || name === 'lastName') {
      // Validate name fields (only letters and spaces)
      if (!namePattern.test(value)) {
        setErrorMessages((prevMessages) => ({
          ...prevMessages,
          [name]: 'Name can only contain letters and spaces',
        }));
        setFormData((prevData) => ({
          ...prevData,
          [name]: '', // Clear the invalid input
        }));
      } else {
        setErrorMessages((prevMessages) => ({
          ...prevMessages,
          [name]: '',
        }));
        setFormData((prevData) => ({
          ...prevData,
          [name]: value, // Update the valid input
        }));
      }
    } else if (name === 'email') {
      // Validate email field with updated rules
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Update email regardless of whether it's valid for typing
      }));
      if (!emailPattern.test(value)) {
        setErrorMessages((prevMessages) => ({
          ...prevMessages,
          [name]: 'Invalid email: Only letters allowed, must contain "@" and a domain (e.g., .com)',
        }));
      } else {
        setErrorMessages((prevMessages) => ({
          ...prevMessages,
          [name]: '',
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Prevent invalid characters from being typed in the email field
  const handleEmailKeyDown = (e) => {
    const key = e.key;

    // Allow only letters, @, and period (.)
    if (!/[a-zA-Z@.]/.test(key) && key !== 'Backspace' && key !== 'Tab') {
      e.preventDefault(); // Prevent from entering other characters
    }

    // Prevent entering more than one "@" symbol
    if (key === '@' && formData.email.includes('@')) {
      e.preventDefault(); // Prevent second "@" character
    }

    // Prevent entering numbers
    if (/[0-9]/.test(key)) {
      e.preventDefault(); // Prevent numbers
    }

    // Prevent special characters
    if (/[!#$%^&*()_+\-=[\]{};':"\\|,<>/?`~]/.test(key)) {
      e.preventDefault(); // Prevent special characters
    }
  };

  // Format numbers with commas and two decimal points
  const formatCurrency = (amount) => {
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Function to download PDF and navigate to home
  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;

    // Add company logo
    doc.addImage(assets.logo, 'jpeg', margin, margin, 50, 50); // Adjust the width and height as needed

    // Add company details
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Jayasinghe Storeline', margin + 60, margin + 10);
    doc.text('No 123, Main Street, Colombo 3', margin + 60, margin + 20);
    doc.text('Email: jayasinghestore line@gmail.com', margin + 60, margin + 30);
    doc.text('Phone: 011 2478458', margin + 60, margin + 40);
    doc.text('Fax: 011 2478458', margin + 60, margin + 50); // Add the fax number here

    // Add title
    doc.setFontSize(18);
    doc.text('Payment Information', margin, margin + 70);

    // Add a horizontal line
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.line(margin, margin + 75, doc.internal.pageSize.getWidth() - margin, margin + 75);

    // Add date
    const date = new Date();
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    doc.setFontSize(14);
    doc.text(`Downloaded on: ${formattedDate}`, margin, margin + 90);

    // Add details as a table
    const tableData = [
      { title: 'First Name', value: formData.firstName },
      { title: 'Last Name', value: formData.lastName },
      { title: 'E-mail', value: formData.email },
      { title: 'Check Out Manager', value: formData.managerName },
      { title: 'Allowance', value: `LKR ${formatCurrency(allowance !== null ? allowance : 0)}` },
      { title: 'Overtime Hours', value: `${overtimeHours && Object.keys(overtimeHours).length > 0 ? Object.values(overtimeHours).join(', ') : 0}` },
      { title: 'Net Salary', value: `LKR ${formatCurrency(totalNetSalary || 0)}` },
    ];

    doc.autoTable({
      head: [['Description', 'Details']],
      body: tableData.map(item => [item.title, item.value]),
      startY: margin + 100, // Adjust starting position for table
      styles: {
        cellPadding: 5,
        fontSize: 12,
        overflow: 'linebreak',
        tableWidth: 'auto',
      },
      theme: 'grid',
      headStyles: {
        fillColor: [60, 60, 60], // Dark gray for header
        textColor: [255, 255, 255], // White text for header
      },
      alternateRowStyles: {
        fillColor: [230, 230, 230], // Light gray for alternate rows
      },
    });

    doc.save('payment-info.pdf');
    
    // Navigate to home page after downloading the PDF
    navigate('/');
  };

  return (
    <form className='place-payment'>
      <div className='place-payment-left'>
        <p className='title'>Payment Information</p>
        <div className='multi-fields'>
          <input
            type='text'
            name='firstName'
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder='First name'
          />
          {errorMessages.firstName && (
            <p style={{ color: 'red' }}>{errorMessages.firstName}</p>
          )}
          <input
            type='text'
            name='lastName'
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder='Last name'
          />
          {errorMessages.lastName && (
            <p style={{ color: 'red' }}>{errorMessages.lastName}</p>
          )}
        </div>
        <div className='multi-fields'>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            onKeyDown={handleEmailKeyDown} // Handle key down event for validation
            placeholder='E-mail Address'
          />
          {errorMessages.email && (
            <p style={{ color: 'red' }}>{errorMessages.email}</p>
          )}
          <input
            type='text'
            name='managerName'
            value={formData.managerName} // Bind to managerName state
            onChange={handleInputChange}
            placeholder='Manager Name'
          />
        </div>
      </div>

      <div className='place-payment-right'>
        <h2>Total Salary</h2>
        <div>
          <hr />
          <div className='payroll-total-details'>
            <p>Allowance</p>
            <p>LKR {formatCurrency(allowance !== null ? allowance : 0)}</p>
          </div>
          <hr />
          <div className='payroll-total-details'>
            <p>Overtime Hours</p>
            <p>
              {overtimeHours && Object.keys(overtimeHours).length > 0
                ? Object.values(overtimeHours).join(', ')
                : 0}
            </p>
          </div>
          <hr />
          <div className='payroll-total-details'>
            <p>Net Salary</p>
            <p>LKR {formatCurrency(totalNetSalary || 0)}</p>
          </div>
          <hr />
 <div className='download-pdf'>
            <button type='button' onClick={downloadPDF}>
              Download PDF
            </button>
            
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlacePayment;