import React from "react";

/**
 * Composant title fade.
 * 
 * @typedef TitleFade
 * @kind functionnal component
 * 
 * @param {Object} props - Les propriétés du composant.
 * @param {string} props.title - Titre du composant.
 * @returns {React.JSX.Element} - Le composant TitleFade.
 */

const TitleFade = ({title, size}) => {
    return (
        <h1 className={`${size} py-5 px-2 bg-gradient-to-r from-light-blue to-medium-blue text-3xl font-bold text-white rounded-md`}>
            {title}
        </h1>
    )
}

export default TitleFade;