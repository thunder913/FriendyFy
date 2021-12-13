import React from "react";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import PopUp from "../PopUp";
import './ApprovePopUp.css'
import OutsideClickHandler from "react-outside-click-handler";

const ApprovePopUp = ({ text, acceptEvent, show, setShow }) => {
    const approveEvent = () => {
        acceptEvent();
    }

    return (
        <PopUp show={show} setShow={setShow} escClose={true}>
            <div className="popup-outer approve-popup">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setShow(false);
                    }}>
                    <div className="popup-inner approve-inner popup-flex-center">
                        <PopUpHeader title={text} closePopUp={() => setShow(false)}></PopUpHeader>
                        <button className="approve-button" onClick={approveEvent}>Approve</button>
                    </div>
                </OutsideClickHandler>
            </div>
        </PopUp>)
}

export default ApprovePopUp;