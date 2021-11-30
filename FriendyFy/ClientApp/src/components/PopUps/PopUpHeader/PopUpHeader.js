import React from "react";
import './PopUpHeader.css';
const PopUpHeader = ({title, closePopUp}) => {
    return(<header className="pop-up-header">
    <p className="pop-up-title">{title}</p>
    <button onClick={closePopUp} className="close-event">x</button>
</header>)
}

export default PopUpHeader;