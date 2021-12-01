import React, {useEffect, useState, useRef} from "react";
import '../PopUp.css';
import './ViewImagePopUp.css';
import ViewImagePopUpRightSide from "./ViewImagePopUpRightSide";

import useScrollBlock from "../../../hooks/useScrollBlock";

const ViewImagePopUp = (props) => {

    const [blockScroll, allowScroll] = useScrollBlock();

    const closePopUpEvent = () => {
        allowScroll();
        props.closePopUp();
    }

    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePopUpEvent();
        }
    }

    useEffect(() => {
        blockScroll();
        window.addEventListener("keydown", escPressed, false);
        return () => {
            window.removeEventListener("keydown", escPressed, false);
          };
    }, [])


    return(<div className="popup-outer image-outer-popup">
        <div className="popup-inner image-popup">
            <button onClick={closePopUpEvent} className="close-popup">x</button>
            <div className={"picture " + (!props.showRightSection ? 'full-width' : '')}>
                <img src={props.post.postImage} alt="" />
            </div>
            {props.showRightSection ? <ViewImagePopUpRightSide props={props}></ViewImagePopUpRightSide> : ''}
        </div>
    </div>)

    // who posted it how long ago 
    // likes count reposts count
    // like commend repost buttons
    //comments with option to add 
    // top right close button
}

export default ViewImagePopUp;