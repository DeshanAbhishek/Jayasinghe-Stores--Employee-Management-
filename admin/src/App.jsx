import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddJobPosting from './pages/AddJobPosting/AddJobPosting';
import ListJobPosting from './pages/ListJobPosting/ListJobPosting';

const App = () => {
    const url = "http://localhost:4000"; // Ensure your backend is running on this URL

    return (
        <div>
            <ToastContainer />
            <Navbar />
            <hr />
            <div className='app-content'>
                <Sidebar />
                <Routes>
                    <Route path="/add" element={<Add url={url} />} />
                    <Route path="/list" element={<List url={url} />} />
                    <Route path="/job-postings" element={<AddJobPosting url={url} />} />
                    <Route path="/list-job-postings" element={<ListJobPosting url={url} />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
