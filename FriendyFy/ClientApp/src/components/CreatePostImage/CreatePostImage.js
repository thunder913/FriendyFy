import React from 'react';
import ImgDropAndCrop from '../ImgDropAndCrop/ImgDropAndCrop';
import './CreatePostImage.css';

const CreatePostImage = ({setImage}) => (
    <div className="create-post-image">
                <ImgDropAndCrop 
                    placeholder="Choose a photo." 
                    setCroppedImg={setImage}
                    imageClass="user-profile-photo"/>
    </div>
)

export default CreatePostImage;