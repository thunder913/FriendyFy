import { faImage, faThumbtack, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextareaAutosize } from '@mui/material';
import React, { useState } from 'react';
import Select from 'react-select';
import { useLoggedIn } from '../../../contexts/LoggedInContext';
import { makePost } from '../../../services/postService';
import CreatePostImage from '../../CreatePostImage/CreatePostImage';
import CreatePostMap from '../../CreatePostMap/CreatePostMap';
import CreatePostPeople from '../../CreatePostPeople/CreatePostPeople';
import './MakePostPopUp.css';
import '../PopUp.css';
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import PopUp from '../PopUp';
import { useThemeContext } from '../../../contexts/ThemeContext';
import OutsideClickHandler from "react-outside-click-handler";
import { NotificationManager } from 'react-notifications';

const MakePostPopUp = ({ hasImage, show, setShow, setRefreshToken }) => {
    const [showImage, setShowImage] = useState(hasImage);
    const [showPeople, setShowPeople] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const [privacySettings, setPrivacySettings] = useState('friends');
    const [postMessage, setPostMessage] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');
    const [people, setPeople] = useState([]);
    const { loggedIn } = useLoggedIn();
    const { theme } = useThemeContext();

    const onPostButtonClick = async () => {
        let peopleIds = people.map(x => x.value)
        if (postMessage.length === 0 && !image) {
            NotificationManager.error('You should either write a message or upload a photo!', '', 2000);
            return;
        }
        await makePost(privacySettings, postMessage, location.lat, location.lng, image, peopleIds)
            .then(async res => {
                let result = await (res.json());
                if (result.success) {
                    setShow(false);
                    setPostMessage('');
                    if(typeof setRefreshToken === 'function'){
                        setRefreshToken(prev => !prev);
                    }
                    NotificationManager.success('Successfully created a post!', '', 2000);
                } else {
                    NotificationManager.error('There was an error making the post!', '', 2000);
                }
            })
    }

    return (
        <PopUp show={show} setShow={setShow} escClose={true}>
            <div className="popup-outer make-post-popup">
                <OutsideClickHandler
                    onOutsideClick={(e) => {
                        if(e.target.getAttribute('role') !== 'option' && !e.target.classList.contains('message')  && !e.target.classList.contains('notification')){
                            setShow(false);
                        }
                    }}>
                    <div className="popup-inner post-popup fancy-scroll">
                        <PopUpHeader title="Create a post" closePopUp={() => setShow(false)}></PopUpHeader>
                        <section className="make-post-underheader">
                            <div className="image">
                                <img src={loggedIn.profilePhoto} alt="" />
                            </div>
                            <span>{loggedIn.firstName} {loggedIn.lastName}</span>
                            <Select
                                theme={(th) => ({
                                    ...th,
                                    colors: (theme === 'dark' ? {
                                        ...th.colors,
                                        primary25: '#595757',
                                        primary: 'rgb(212, 212, 212)',
                                        neutral0: '#3F3B3B',
                                        neutral80: 'white',
                                        neutral60: '#aaaaaa',
                                        neutral10: '#595757',
                                        dangerLight: '#523737',
                                    } : { ...th.colors })
                                })}
                                className="privacy-picker"
                                isSearchable={false}
                                options={[{ value: 'friends', label: 'Friends' }, { value: 'everyone', label: 'Everyone' }]}
                                defaultValue={{ value: privacySettings, label: 'Friends' }}
                                onChange={setPrivacySettings}
                            />
                        </section>
                        <TextareaAutosize
                            onChange={(e) => setPostMessage(e.target.value)}
                            placeholder="What's on your mind?"
                            id="post-message" minRows={3} />
                        <div className="create-post-buttons">
                            <FontAwesomeIcon
                                title="Add an image"
                                className={"post-button-icon " + (showImage ? 'active' : '')}
                                icon={faImage}
                                onClick={() => setShowImage(prev => !prev)}
                            />

                            <FontAwesomeIcon
                                title="Tag people"
                                className={"post-button-icon " + (showPeople ? 'active' : '')}
                                icon={faUserFriends}
                                onClick={() => setShowPeople(prev => !prev)}
                            />
                            <FontAwesomeIcon
                                title="Add a location"
                                className={"post-button-icon " + (showMap ? 'active' : '')}
                                icon={faThumbtack}
                                onClick={() => setShowMap(prev => !prev)}
                            />
                        </div>
                        {showImage ? <CreatePostImage setImage={setImage} /> : ''}
                        {showPeople ? <CreatePostPeople
                            onChange={(people) => setPeople(people)}
                        /> : ''}
                        {showMap ? <CreatePostMap location={location} setLocation={setLocation} /> : ''}
                        <button className="post" onClick={onPostButtonClick}>Post</button>
                    </div>
                </OutsideClickHandler>
            </div>
        </PopUp>)
}

export default MakePostPopUp;