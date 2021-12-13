import React, { useState } from "react";
import './AddImagePopUp.css';
import ImgDropAndCrop from "../../ImgDropAndCrop/ImgDropAndCrop";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import { addImageToEvent } from "../../../services/eventService";
import NotificationManager from "react-notifications/lib/NotificationManager";
import { NotificationContainer } from "react-notifications";
import PopUp from "../PopUp";
import OutsideClickHandler from "react-outside-click-handler";

const AddImagePopUp = ({ eventId, setImages, show, setShow }) => {
    const [image, setImage] = useState('');

    const onCreateButtonClicked = () => {
        if (!image) {
            NotificationManager.error('You must select an image!', '', 2000);
        }
        addImageToEvent(eventId, image)
            .then(async res => {
                let text = await res.text();
                if (res.status === 200) {
                    NotificationManager.success('Successfully uploaded an image!', '', 2000);
                    setImages(prev => [...prev, text]);
                    setShow(false);
                } else {
                    NotificationManager.error(text, '', 2000);
                }
            })
    }

    return (
        <PopUp show={show} setShow={setShow} escClose={true}>
            <div className="popup-outer add-image-outer-popup">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setShow(false);
                    }}>
                    <NotificationContainer />
                    <div className="popup-inner add-image-inner-popup popup-flex-center">
                        <PopUpHeader title="Add an image to your event" closePopUp={() => setShow(false)}></PopUpHeader>
                        <div className="add-event-image">
                            <ImgDropAndCrop
                                placeholder="Import an image for the event."
                                setCroppedImg={setImage}
                                imageClass="user-profile-photo" />
                        </div>
                        <button className="add-image" onClick={onCreateButtonClicked}>Add image</button>
                    </div>
                </OutsideClickHandler>
            </div>
        </PopUp>)
}

export default AddImagePopUp;