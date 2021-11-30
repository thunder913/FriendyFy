import { faCalendarPlus, faImages,  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import MakePostPopUp from '../MakePostPopUp/MakePostPopUp.js';
import useScrollBlock from "../../hooks/useScrollBlock";
import './MakePost.css';
import CreateEventPopUp from '../CreateEventPopUp/CreateEventPopUp';

const MakePost = ({showCreatePost ,showPostImage, showCreateEvent}) =>{
    const { loggedIn } = useLoggedIn();
    const [showEventPopUp, setShowEventPopUp] = useState(false);
    const [showPostPopUp, setshowPostPopUp] = useState(false);
    const [postWithImage, setPostWithImage] = useState(false);
    const [blockScroll, allowScroll] = useScrollBlock()

    const CreatePostWithoutImage = () => {
        setPostWithImage(false);
        setshowPostPopUp(true);
        window.scrollTo(0,0);
    }

    const CreatePostWithImage = () => {
        setPostWithImage(true);
        setshowPostPopUp(true);
    }

    const CreateEvent = () => {
        setShowEventPopUp(true);
    }

    const closePostPopUp = () => {
        setshowPostPopUp(false);
    }

    const closeEventPopUp = () => {
        setShowEventPopUp(false);
    }

    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePostPopUp();
            closeEventPopUp();
        }
    }

    useEffect(() => {
        if(showPostPopUp || showEventPopUp){
            blockScroll();
        }else{
            allowScroll();
        }
    }, [showEventPopUp, showPostPopUp])

    useEffect(() => {
        window.addEventListener("keydown", escPressed, false);
        return () => {
            window.removeEventListener("keydown", escPressed, false);
          };
    }, [])

    return(
    <section className="make-post">
        {showCreatePost ?
        <article onClick={CreatePostWithoutImage} className="make-post-text">
            <p>Share a thought with you friends, {loggedIn.firstName}</p>
        </article> : ''}
        {showPostImage ? <article 
            className="make-post-image"
            onClick={CreatePostWithImage}>
            <FontAwesomeIcon 
                title="Add an image"
                className="image-icon"
                icon={faImages}
                />
        </article> : ''}

        {showCreateEvent ? <article onClick={CreateEvent} className="create-event">
                <FontAwesomeIcon 
                    title="Create an event" 
                    className="create-event-icon" 
                    icon={faCalendarPlus}
                    ></FontAwesomeIcon>
        </article> : ''}
        {showPostPopUp ? 
        <MakePostPopUp 
            hasImage={postWithImage}
            closePopUp={closePostPopUp}
        /> : ''}
        {showEventPopUp ?
        <CreateEventPopUp
            closePopUp={closeEventPopUp}
        />: ''}
    </section>)
}

export default MakePost;