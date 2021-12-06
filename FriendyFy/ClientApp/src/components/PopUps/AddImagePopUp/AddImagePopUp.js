import React, {useState, useEffect} from "react";
import './AddImagePopUp.css';
import ImgDropAndCrop from "../../ImgDropAndCrop/ImgDropAndCrop";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import useScrollBlock from "../../../hooks/useScrollBlock";
import { addImageToEvent } from "../../../services/eventService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { NotificationContainer } from "react-notifications";
import PopUp from "../PopUp";
const AddImagePopUp = ({eventId, setImages, show, setShow}) => {
    const [image, setImage] = useState('');
    const [blockScroll, allowScroll] = useScrollBlock();

    const closePopUpEvent = () => {
        allowScroll();
        setShow(false);
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
        if(show){
            blockScroll();
            window.addEventListener("keydown", escPressed, false);
            return () => {
                window.removeEventListener("keydown", escPressed, false);
              };
        }
    }, [show])

    return(
        <PopUp show={show} setShow={setShow}>
        <div className="popup-outer add-image-outer-popup">
        <NotificationContainer/>
    <div className="popup-inner add-image-inner-popup popup-flex-center">
        <PopUpHeader title="Add an image to your event" closePopUp={closePopUpEvent}></PopUpHeader>
        <div className="add-event-image">
            <ImgDropAndCrop 
                placeholder="Import an image for the event." 
                setCroppedImg={setImage}
                imageClass="user-profile-photo"/>
        </div>
        <button className="add-image" onClick={onCreateButtonClicked}>Add image</button>
    </div>
</div>
</PopUp>)
}

export default AddImagePopUp;