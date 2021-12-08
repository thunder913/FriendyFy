import React from 'react';
import './RegisterPopUp.css';
import Register from "../Register/Register";
import PopUp from '../../PopUps/PopUp';
import PopUpHeader from '../../PopUps/PopUpHeader/PopUpHeader';

const RegisterPopUp = ({ show, setShow }) => (
    <PopUp show={show} setShow={setShow} escClose={true}>
        <div className="popup-outer map-popup">
            <div className="popup-inner inner-map-popup">
                <PopUpHeader title="Register Now!" closePopUp={() => setShow(false)}></PopUpHeader>
                <Register />
            </div>
        </div>
    </PopUp>

)

export default RegisterPopUp