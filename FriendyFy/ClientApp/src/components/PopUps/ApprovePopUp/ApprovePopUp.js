import React, { useEffect } from "react";
import useScrollBlock from "../../../hooks/useScrollBlock";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import PopUp from "../PopUp";
import './ApprovePopUp.css'

const ApprovePopUp = ({ text, acceptEvent, show, setShow }) => {
    const approveEvent = () => {
        acceptEvent();
    }

    return (
        <PopUp show={show} setShow={setShow}>
            <div className="popup-outer approve-popup">
                <div className="popup-inner approve-inner popup-flex-center">
                    <PopUpHeader title={text} closePopUp={() => setShow(false)}></PopUpHeader>
                    <button className="approve-button" onClick={approveEvent}>Approve</button>
                </div>
            </div>
        </PopUp>)
}

export default ApprovePopUp;