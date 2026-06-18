import React, {useEffect, useState} from "react";
import AlertBannerSuccess from "./alertBannerSuccess";
import AlertBannerError from "./alertBannerError";
import AlertBannerInfo from "./alertBannerInfo";
import AlertBannerWarning from "./alertBannerWarning";

const AlertBanner = ({description, type }) => {
    const [isDisplay, setIsDisplay] = useState(true);  


    useEffect(() => {
        const timer = setTimeout(() => {
            setIsDisplay(false)
        }, 3000); 

        return () => clearTimeout(timer);
    }, [setIsDisplay]);

    let alert = null
    switch (type) {
        case "success":
            alert = <AlertBannerSuccess description={description}/>
            break;
        case "error":
            alert = <AlertBannerError description={description}/>
            break;
        case "warning":
            alert = <AlertBannerWarning description={description}/>
            break;
        default:
            alert = <AlertBannerInfo description={description}/>
            break;
    }
    
    return (
            <div className={`toast toast-top toast-center toast-${type}`}>
                {isDisplay === true && alert}
            </div>
    )
}

export default AlertBanner;