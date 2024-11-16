import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const { token, setToken } = useContext(StoreContext);
  const [menu, setMenu] = useState('home');

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>
          Home
        </Link>
        <a href="#explore-employee" onClick={() => setMenu('all-heads')} className={menu === 'all-heads' ? 'active' : ''}>
          All Heads
        </a>
        <a href="http://localhost:5173/add" onClick={() => setMenu('mobile-app')} className={menu === 'mobile-app' ? 'active' : ''}>
          Admin Dashboard
        </a>
        <a href="/laws" onClick={() => setMenu('laws')} className={menu === 'laws' ? 'active' : ''}>
          Laws
        </a>
      </ul>
      <div className="navbar-right">
      
        <div className="navbar-search-icon">
          <Link to="/payroll">
            <img src={assets.basket_icon} alt="basket" />
          </Link>
          <div className="dot"></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="profile" />
            <ul className="nav-profile-dropdown">
              <li>
                <img src={assets.bag_icon} alt="bag" />
                <p>Payments</p>
              </li>
              <hr />
              <li onClick={() => setToken(null)}>
                <img src={assets.logout_icon} alt="logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;