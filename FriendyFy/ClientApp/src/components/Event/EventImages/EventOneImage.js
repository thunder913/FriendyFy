import React from "react";
import './EventOneImage.css'

const EventOneImage = ({image}) => {
    return(
        <div className="one-image">
            <img src={image} alt="" />
        </div>
    )
}

export default EventOneImage;