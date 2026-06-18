import AlertBanner from "../components/AlertBanner/alertBanner";

/**
 * Hook display alert.
 * 
 * @typedef useDisplayAlert
 * @kind hook
 * 
 * @param {Object} props
 * @param {string} props.message
 * @returns {React.JSX.Element}
 */
const useDisplayAlert = (message) => {
    let alertBanner = null; 

    if((200 <= message.code) && (message.code<300)){
        alertBanner = <AlertBanner description={message.description} type="success"/>
    }else if((400 <= message.code) && (message.code<500)){
        alertBanner = <AlertBanner description={message.description} type="error"/>
    }else if((300 <= message.code) && (message.code<400)){
        alertBanner = <AlertBanner description={message.description} type="infos"/>
    };

    return {alertBanner};
}

export default useDisplayAlert;