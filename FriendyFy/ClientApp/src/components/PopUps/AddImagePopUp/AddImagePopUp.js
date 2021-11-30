import React, {useState, useEffect} from "react";
import './AddImagePopUp.css';
import ImgDropAndCrop from "../../ImgDropAndCrop/ImgDropAndCrop";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import useScrollBlock from "../../../hooks/useScrollBlock";
import { addImageToEvent } from "../../../services/eventService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { NotificationContainer } from "react-notifications";

const AddImagePopUp = ({closePopUp, eventId, setImages}) => {
    const [image, setImage] = useState('');
    const [blockScroll, allowScroll] = useScrollBlock();

    const closePopUpEvent = () => {
        allowScroll();
        closePopUp();
    }

    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePopUpEvent();
        }
    }

    const onCreateButtonClicked = () => {
        if(!image){
            NotificationManager.error('You must select an image!', '', 2000);
        }
        addImageToEvent(eventId, image)
            .then(async res => {
                let text = await res.text();
                if(res.status === 200){
                    NotificationManager.success('Successfully uploaded an image!', '', 2000);
                    setImages(prev => [...prev, text]);
                    closePopUpEvent();
                }else{
                    NotificationManager.error(text, '', 2000);                    
                }
            })
    }

    useEffect(() => {
        blockScroll();
        window.addEventListener("keydown", escPressed, false);
        return () => {
            window.removeEventListener("keydown", escPressed, false);
          };
    }, [])

    return(<div className="add-image-popup">
        <NotificationContainer/>
    <div className="image-popup">
        <PopUpHeader title="Add an image to your event" closePopUp={closePopUpEvent}></PopUpHeader>
        <div className="add-event-image">
            <ImgDropAndCrop 
                placeholder="Import an image for the event." 
                setCroppedImg={setImage}
                imageClass="user-profile-photo"/>
        </div>
        <button className="add-image" onClick={onCreateButtonClicked}>Add image</button>
    </div>
</div>)
}

export default AddImagePopUp;