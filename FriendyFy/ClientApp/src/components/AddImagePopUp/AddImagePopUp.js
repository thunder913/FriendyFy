import React, {useState} from "react";
import './AddImagePopUp.css';
import ImgDropAndCrop from "../ImgDropAndCrop/ImgDropAndCrop";
import PopUpHeader from "../PopUpHeader/PopUpHeader";

const AddImagePopUp = ({closePopUp}) => {
    const [image, setImage] = useState('');

    const onCreateButtonClicked = () => {

    }

    return(<div className="add-image-popup">
    <div className="image-popup">
        <PopUpHeader title="Add an image to your event" closePopUp={closePopUp}></PopUpHeader>
        <div className="create-event-image">
            <ImgDropAndCrop 
                placeholder="Import an image for the event." 
                setCroppedImg={setImage}
                imageClass="user-profile-photo"/>
        </div>
        <button className="create-event" onClick={onCreateButtonClicked}>Add image</button>
    </div>
</div>)
}

export default AddImagePopUp;