import React from "react";
import './EventTwoImages.css'

const EventTwoImages = ({images}) => {
    return(
        <div className="two-images">
            {images.map(img => <div className="image"><img src={img} alt="" /></div>)}
        </div>
    )
}

export default EventTwoImages;