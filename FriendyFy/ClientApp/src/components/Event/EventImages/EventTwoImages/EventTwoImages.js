import React from "react";
import './EventTwoImages.css'

const EventTwoImages = ({images, showImagePopUp}) => {
    return(
        <div className="two-images" >
            {images.map(img => <div key={img} className="image" onClick={() => showImagePopUp(img)}><img src={img} alt="" /></div>)}
        </div>
    )
}

export default EventTwoImages;