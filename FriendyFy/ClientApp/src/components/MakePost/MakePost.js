import { faCalendarPlus, faImages,  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import MakePostPopUp from '../MakePostPopUp/MakePostPopUp.js';
import useScrollBlock from "../../hooks/useScrollBlock";
import './MakePost.css';

const MakePost = () =>{
    const { loggedIn } = useLoggedIn();
    const [showPopUp, setShowPopUp] = useState(false);
    const [postWithImage, setPostWithImage] = useState(false);
    const [blockScroll, allowScroll] = useScrollBlock();
    const CreatePostWithoutImage = () => {
        setPostWithImage(false);
        setShowPopUp(true);
    }

    const CreatePostWithImage = () => {
        setPostWithImage(true);
        setShowPopUp(true);
    }

    const closePopUp = () => {
        setShowPopUp(false);
    }

    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePopUp();
        }
    }

    useEffect(() => {
        if(showPopUp){
            blockScroll();
        }else{
            allowScroll();
        }
    })

    useEffect(() => {
        document.addEventListener("keydown", escPressed, false);
        return () => {
            document.removeEventListener("keydown", escPressed, false);
          };
    }, [])

    return(
    <section className="make-post">
        <article onClick={CreatePostWithoutImage} className="make-post-text">
            <p>Share a thought with you friends, {loggedIn.firstName}</p>
        </article>
        <article 
            className="make-post-image"
            onClick={CreatePostWithImage}>
            <FontAwesomeIcon 
                title="Add an image"
                className="image-icon"
                icon={faImages}
                />
        </article>

        <article className="create-event">
                <FontAwesomeIcon 
                    title="Create an event" 
                    className="create-event-icon" 
                    icon={faCalendarPlus}
                    ></FontAwesomeIcon>
        </article>
        {showPopUp ? 
        <MakePostPopUp 
            hasImage={postWithImage}
            closePopUp={closePopUp}
        /> : ''}
    </section>)
}

export default MakePost;