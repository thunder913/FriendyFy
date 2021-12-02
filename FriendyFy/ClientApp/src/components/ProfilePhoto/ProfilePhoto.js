import React from 'react';
import './ProfilePhoto.css';

const ProfilePhoto = ({image, showImagePopUpEvent, id}) => {
    

    return (<div className="user-photo" onClick={() => showImagePopUpEvent(id)}>
        <img src={image} alt="" />
    </div>)
}

export default ProfilePhoto;