import React, { useEffect } from "react";
import '../PopUp.css';
import './ViewImagePopUp.css';
import ViewImagePopUpRightSide from "./ViewImagePopUpRightSide";
import PopUp from "../PopUp";

const ViewImagePopUp = (props) => {

    return (
        <PopUp show={props.show} setShow={props.setShow}>
            <div className="popup-outer image-outer-popup">
                <div className="popup-inner image-popup">
                    <button onClick={() => props.setShow(false)} className="close-popup">x</button>
                    <div className={"picture " + (!props.showRightSection ? 'full-width' : '')}>
                        <img src={props.post.postImage} alt="" />
                    </div>
                    {props.showRightSection ? <ViewImagePopUpRightSide props={props}></ViewImagePopUpRightSide> : ''}
                </div>
            </div>
        </PopUp>)
}

export default ViewImagePopUp;