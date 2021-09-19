import React from 'react';
import './ProfilePhoto.css';

const ProfilePhoto = ({image}) => (
    <div className="user-photo">
        <img src={image} alt="" />
    </div>
)

export default ProfilePhoto;