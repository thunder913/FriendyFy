import { faCalendarPlus, faImages,  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import MakePostPopUp from '../PopUps/MakePostPopUp/MakePostPopUp.js';
import './MakePost.css';
import CreateEventPopUp from '../PopUps/CreateEventPopUp/CreateEventPopUp';

const MakePost = ({showCreatePost ,showPostImage, showCreateEvent}) =>{
    const { loggedIn } = useLoggedIn();
    const [showEventPopUp, setShowEventPopUp] = useState(false);
    const [showPostPopUp, setshowPostPopUp] = useState(false);
    const [postWithImage, setPostWithImage] = useState(false);

    const CreatePostWithoutImage = () => {
        setPostWithImage(false);
        setshowPostPopUp(true);
        window.scrollTo(0,0);
    }

    const CreatePostWithImage = () => {
        setPostWithImage(true);
        setshowPostPopUp(true);
    }

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

        {showCreateEvent ? <article onClick={() => setShowEventPopUp(true)} className="create-event">
                <FontAwesomeIcon 
                    title="Create an event" 
                    className="create-event-icon" 
                    icon={faCalendarPlus}
                    ></FontAwesomeIcon>
        </article> : ''}
        <MakePostPopUp 
            show={showPostPopUp}
            setShow={setshowPostPopUp}
            hasImage={postWithImage}
        />
        <CreateEventPopUp
            show={showEventPopUp}
            setShow={setShowEventPopUp}
        />
    </section>)
}

export default MakePost;