import React from "react";

const ConnexionButton = ({handleOnClick, title}) => {
    return (                
    <button 
        onClick={()=>{handleOnClick()}}
        className="hover:bg-light-blue bg-gradient-to-br bg-medium-blue hover:bg-light-blue border-solid border-2 border-light-blue  font-bold text-white px-5 py-2 rounded-full "
      >
        {title}
      </button>);
}

export default ConnexionButton;