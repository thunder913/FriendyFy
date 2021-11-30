import React from "react";
import '../PopUp.css';
import './ViewImagePopUp.css'

const ViewImagePopUp = () => {
    return(<div className="popup-outer image-outer-popup">
        <div className="popup-inner image-popup">
            <div className="picture">
                <img src="https://previews.123rf.com/images/blamb/blamb1407/blamb140700115/29608891-a-cartoon-man-with-really-long-legs-.jpg" alt="" />
            </div>
            <div className="right-side">
                <h1>test</h1>
            </div>
        </div>
    </div>)
}

export default ViewImagePopUp;