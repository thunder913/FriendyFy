import React from "react";
import './EventOneImage.css'

const EventOneImage = ({image, showImagePopUp}) => {
    return(
        <div className="one-image" onClick={() => showImagePopUp(image)}>
            <img src={image} alt="" />
        </div>
    )
}

export default EventOneImage;