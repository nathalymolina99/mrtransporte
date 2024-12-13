import React from 'react';
import '../App.css'
import logo from '../images/titulo.png';


const Logo = () => {
  return (
    <div className="header-logo-container">
      <img src={logo} alt="logo" className="header-logo-image" />
    </div>
  );
};

export default Logo;