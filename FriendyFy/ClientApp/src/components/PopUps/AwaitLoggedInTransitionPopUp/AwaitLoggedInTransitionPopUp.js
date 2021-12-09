import React from "react";
import PopUp from "../PopUp";
import Loader from "react-loader-spinner";
import './AwaitLoggedInTransitionPopUp.css'

const AwaitLoggedInTransitionPopUp = ({ show, setShow }) => {
    return (<PopUp escClose={false} show={show} setShow={setShow}>
        <div className="popup-outer await-transition">
            <div className="loading-logo">
                <img src={require('../../../static/text.png')} alt="" />
            </div>
            <Loader
                type="BallTriangle"
                color="#50A6FA"
                height={200}
                width={200}
                className="loader"
            />
            <h2 className="loading-text">LOADING</h2>
        </div>
    </PopUp>)
}

export default AwaitLoggedInTransitionPopUp;