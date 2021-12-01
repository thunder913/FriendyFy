import React from "react";
import './EventThreeImages.css'

const EventThreeImages = ({images, showImagePopUp}) => {
    return(
        <div className="three-images">
            <div className="two-images-top">
                <div className="top-image" onClick={() => showImagePopUp(images[0])}>
                    <img src={images[0]} alt="" />
                </div>
                <div className="top-image" onClick={() => showImagePopUp(images[1])}>
                    <img src={images[1]} alt="" />
                </div>
            </div>
            <div className="bottom-image">
            <div className="image" onClick={() => showImagePopUp(images[2])}>
                    <img src={images[2]} alt="" />
                </div>
            </div>
        </div>
    )
}

export default EventThreeImages;