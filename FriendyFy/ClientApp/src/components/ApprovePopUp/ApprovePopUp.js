import React, {useEffect} from "react";
import './ApprovePopUp.css'
import useScrollBlock from "../../hooks/useScrollBlock";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
const ApproveEventPopUp = ({text, acceptEvent, closePopUp}) => {
    const [blockScroll, allowScroll] = useScrollBlock();
    
    const closePopUpEvent = () => {
        allowScroll();
        closePopUp();
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


    return(<div className="approve-popup">
    <div className="approve-inner">
        <PopUpHeader title={text} closePopUp={closePopUpEvent}></PopUpHeader>
        <button className="approve-button" onClick={acceptEvent}>Approve</button>
    </div>
</div>)
}

export default ApproveEventPopUp;