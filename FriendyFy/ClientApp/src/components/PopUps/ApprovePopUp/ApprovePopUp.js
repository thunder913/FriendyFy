import React, {useEffect} from "react";
import useScrollBlock from "../../../hooks/useScrollBlock";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import '../PopUp.css';
import './ApprovePopUp.css'

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

    const approveEvent = () => {
        allowScroll();
        acceptEvent();
    }

    useEffect(() => {
        blockScroll();
        window.addEventListener("keydown", escPressed, false);
        return () => {
            window.removeEventListener("keydown", escPressed, false);
          };
    }, [])


    return(<div className="popup-outer approve-popup">
    <div className="popup-inner approve-inner popup-flex-center">
        <PopUpHeader title={text} closePopUp={closePopUpEvent}></PopUpHeader>
        <button className="approve-button" onClick={approveEvent}>Approve</button>
    </div>
</div>)
}

export default ApproveEventPopUp;