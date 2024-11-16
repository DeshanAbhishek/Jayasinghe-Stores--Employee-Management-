import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Payroll from './pages/Payroll/Payroll'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Home from './Pages/Home/Home'
import PlacePayment from './Pages/PlacePayment/PlacePayment'
import LaborLawsForm from './Pages/Laws/Laws'

const App = () => {

  const [showLogin,setShowLogin] = useState(false)

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin} />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/payroll' element={<Payroll/>}></Route>
        <Route path='/payment' element={<PlacePayment/>}></Route>
        <Route path='/laws' element={<LaborLawsForm/>}></Route>
      </Routes>
    </div>
    <Footer/>
    </>
    
  )
}

export default App
