import React from "react";
import PopUp from "../PopUp";
import Loader from "react-loader-spinner";
const AwaitLoggedInTransitionPopUp = ({ show, setShow }) => {
    return (<PopUp escClose={false} show={show} setShow={setShow}>
        <div className="popup-outer">
            <div className="popup-inner">
                <Loader
                    type="BallTriangle"
                    color="#50A6FA"
                    height={200}
                    width={200}
                    className="loader"
                />
            </div>
        </div>
    </PopUp>)
}

export default AwaitLoggedInTransitionPopUp;