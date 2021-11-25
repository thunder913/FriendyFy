import React from "react";
import './EventThreeImages.css'

const EventThreeImages = ({images}) => {
    return(
        <div className="three-images">
            <div className="two-images-top">
                <div className="top-image">
                    <img src={images[0]} alt="" />
                </div>
                <div className="top-image">
                    <img src={images[2]} alt="" />
                </div>
            </div>
            <div className="bottom-image">
            <div className="image">
                    <img src={images[2]} alt="" />
                </div>
            </div>
        </div>
    )
}

export default EventThreeImages;