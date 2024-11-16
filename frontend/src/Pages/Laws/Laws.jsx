import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Laws.css'

const Laws = () => {
  const [laws, setLaws ] = useState(() => {
    const storedLaws = localStorage.getItem('laws');
    return storedLaws ? JSON.parse(storedLaws) : [
      {
        id: 1,
        title: 'Workweek and Flexibility',
        description: 'There is a shift towards a 5-day workweek from the previous 5 ½ days. Additionally, flexible working hours, part-time employment, and work-from-home options are recognized, aligning with modern global employment trends.',
      },
      {
        id: 2,
        title: 'Paternity Leave and Domestic Workers',
        description: 'The proposed laws introduce paternity leave for the first time and include legal recognition and protection for domestic workers, which previously lacked formal regulation.',
      },
      {
        id: 3,
        title: 'Social Security and E-Wages',
        description: 'A new Social Security Insurance Fund is being established to cover unemployment, maternity, health benefits, and compensation. There is also a push to introduce an e-wages system for streamlined salary payments.',
      },
      {
        id: 4,
        title: 'Retirement and Compensation',
        description: 'The uniform retirement age is set at 55 years. Additionally, the process for employment termination is being simplified, with compensation schemes included for cases of restructuring or layoffs due to external factors such as lack of raw materials or machinery breakdowns.',
      },
      {
        id: 5,
        title: 'Trade Union and Employee Rights',
        description: 'New regulations aim to balance the rights between employers and trade unions. There\'s also increased regulation of unfair labor practices and a requirement for a minimum percentage of women on the executive boards of trade unions.',
      },
      {
        id: 6,
        title: 'Workplace Harassment and Discrimination',
        description: 'The laws provide wider protection against discrimination and harassment, including sexual harassment in the workplace, making it mandatory for employers to ensure a safe work environment.',
      },
      {
        id: 7,
        title: 'Occupational Safety and Health',
        description: 'New rules focus on improving occupational safety, health, and welfare for employees across various industries.',
      },
      {
        id: 8,
        title: 'Wage Regulation and Apprenticeships',
        description: 'The National Remuneration Council is expected to play a larger role in setting minimum wages for different sectors, and there are provisions to regulate trainee and apprenticeship programs, ensuring fair treatment for students employed while studying.',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('laws', JSON.stringify(laws));
  }, [laws]);

  const [lawTitle, setLawTitle] = useState('');
  const [lawDescription, setLawDescription] = useState('');
  const [selectedLaw, setSelectedLaw] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredLaws = laws.filter((law) => {
    const lowerCaseTitle = law.title.toLowerCase();
    const lowerCaseDescription = law.description.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return lowerCaseTitle.includes(lowerCaseSearchTerm) || lowerCaseDescription.includes(lowerCaseSearchTerm);
  });

  const handleUpdate = () => {
    if (selectedLaw) {
      const updatedLaws = laws.map((law) => {
        if (law.id === selectedLaw.id) {
          return { ...law, title: lawTitle, description: lawDescription };
        }
        return law;
      });
      setLaws(updatedLaws);
      setLawTitle('');
      setLawDescription('');
      setSelectedLaw(null);
    }
  };

  const handleRemove = () => {
    if (selectedLaw) {
      const updatedLaws = laws.filter((law) => law.id !== selectedLaw.id);
      setLaws(updatedLaws);
      setLawTitle('');
      setLawDescription('');
      setSelectedLaw(null);
    }
  };

  const handleAdd = () => {
    const newLawId = laws.length + 1;
    const newLaw = { id: newLawId, title: lawTitle, description: lawDescription };
    setLaws([...laws, newLaw]);
    setLawTitle('');
    setLawDescription('');
  };

  const handleSelectLaw = (law) => {
    setSelectedLaw(law);
    setLawTitle(law.title);
    setLawDescription(law.description);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const margin = 10;
    const assets = {
      logo: 'https://example.com/logo.jpg',
    };

    doc.addImage(assets.logo, 'jpeg', margin, margin, 50, 50); // Adjust the width and height as needed

    // Add company details
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Jayasinghe Storeline', margin + 60, margin + 10);
    doc.text('No 123, Main Street, Colombo 3', margin + 60, margin + 20);
    doc.text('Email: jayasinghestoreline@gmail.com', margin + 60, margin + 30);
    doc.text('Phone: 011 2478458', margin + 60, margin + 40);
    doc.text('Fax: 011 2478458', margin + 60, margin + 50);

    // Add date and time
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    doc.text(`Date: ${formattedDate}`, margin + 60, margin + 60);
    doc.text(`Time: ${formattedTime}`, margin + 60, margin + 70);

    // Add laws table
    const lawsTable = [];
    laws.forEach((law) => {
      lawsTable.push([law.title, law.description]);
    });
    doc.autoTable({
      head: [['Title', 'Description']],
      body: lawsTable,
      columns: [
        { header: 'Title', dataKey: 0 },
        { header: 'Description', dataKey: 1 },
      ],
    });

    // Save the PDF
    doc.save('laws.pdf');
  };

  return (
    <div>
      <h1>Labor Laws and Regulations</h1>
      <form>
        <label>
          Law Title:
          <input type="text" value={lawTitle} onChange={(event) => setLawTitle(event.target.value)} />
        </label>
        <label>
          Law Description:
          <textarea value={lawDescription} onChange={(event) => setLawDescription(event.target.value)} />
        </label>
        <button type="button" onClick={handleAdd}>Add Law</button>
        <button type="button" onClick={handleUpdate}>Update Law</button>
        <button type="button" onClick={handleRemove}>Remove Law</button>
      </form>
      <input type="search" value={searchTerm} onChange={handleSearch} placeholder="Search laws" />
      <ul>
        {filteredLaws.map((law) => (
          <li key={law.id}>
            <h2>{law.title}</h2>
            <p>{law.description}</p>
            <button type="button" onClick={() => handleSelectLaw(law)}>Select</button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={handleDownloadPdf}>Download PDF</button>
    </div>
  );
};

export default Laws;