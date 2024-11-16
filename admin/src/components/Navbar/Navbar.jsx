import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets.js'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img className='logo' src={assets.logo} alt=''/>
        <Link to="http://localhost:5174">Home</Link>
    </div>
  )
}

export default Navbar