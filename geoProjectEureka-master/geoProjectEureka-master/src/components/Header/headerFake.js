import React from "react";
import logo from "../../assets/images/Siemens-logo.png"
import { Link } from 'react-router-dom';

const HeaderFake = () => {
 
  
  
    return (
      <header className="bg-light-grey relative shadow-lg px-3 py-2">
      <nav className="flex justify-between">
      <div className="w-[130px] md:w-[200px] flex items-center">
          <Link to={'/'}>
              <img src={logo} alt="logo" className="w-20"/>
          </Link>
        </div>     
      </nav>
    </header>
     );
}

export default HeaderFake;