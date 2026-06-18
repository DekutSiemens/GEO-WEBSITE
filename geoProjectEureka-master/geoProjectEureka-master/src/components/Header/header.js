import React, { Fragment, useState } from "react";
import HeaderProfile from "./headerProfile";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import ConnexionButton from "../ConnexionButton/connexionButton";
import logo from "../../assets/images/Siemens-logo.png";
import useLogOut from "../../hooks/useLogOut";
import {userHeader, adminHeader} from "./headerForm";

const Header = ({connected, role}) => {
  const [isSelected, setIsSelected] = useState(false);
  const {logout} = useLogOut();
  const navigate = useNavigate();

  const handleSetIsSelected = () => {
    setIsSelected(!isSelected)
  }

  const login = () =>{
    navigate('/login');
  }

  let menuTab = [];

  switch (role) {
    case "user":
      menuTab = userHeader;
      break;
    case "admin":
      menuTab = adminHeader;
    break;
    default:
      menuTab = [];
      break;
  }

  const menu = menuTab && menuTab.map((menu,index)=>{
    return (
      <li className={`relative max-w-fit pr-3 text-xl font-bold md:pr-0 py-1 rounded-full hover:underline-offset-4 hover:text-blue-600 ${isSelected && "absolute h-2 bottom-0 left-0  hover:w-full transition-all duration-300"}`} key={index}>
        <Link to={menu.link} className={'px-2'}>
          {menu.title}
        </Link>
      </li>
  )
  })
  
  
    return (
      <header className="bg-light-grey relative shadow-lg px-3 py-2">
      <nav className="flex justify-between">

        <div className="w-[130px] md:w-[200px] flex items-center ml-10">
          <Link to={'/'}>
              <img src={logo} className="w-20" alt="logo"/>
          </Link>
        </div>

        
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            {
              connected ?
              <Fragment>
                <div className={`navLinks absolute md:static md:w-auto w-full md:h-auto h-[85vh] flex md:items-center gap-[1.5vw] top-[100%] left-[-100%] px-5 md:py-0 py-5 z-50 ${isSelected && "left-[0%] bg-white"}`} >
                  <ul className="flex md:flex-row flex-col md:items-center md:gap-[2vw] gap-8">
                    {menu}
                  </ul>
                </div>
                
                <ConnexionButton
                    handleOnClick={logout}
                    title={"Logout"}
                 />
                <HeaderProfile isSelected={isSelected} handleSetIsSelected={handleSetIsSelected}/>
                </Fragment>
              :
              <ConnexionButton
                handleOnClick={login}
                title={"Sign in"}
              />
            }
          </div>
        </div>
      </nav>
    </header>
     );
}

export default Header;