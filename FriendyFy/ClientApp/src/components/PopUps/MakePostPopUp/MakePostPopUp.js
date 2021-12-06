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
const MakePostPopUp = ({ hasImage, show, setShow }) => {
    const [showImage, setShowImage] = useState(hasImage);
    const [showPeople, setShowPeople] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const [privacySettings, setPrivacySettings] = useState('friends');
    const [postMessage, setPostMessage] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState('');
    const [people, setPeople] = useState([]);
    const { loggedIn } = useLoggedIn();

    const onPostButtonClick = async () => {
        let peopleIds = people.map(x => x.value)
        if (postMessage.length == 0 && !image) {
            return;
        }
        await makePost(privacySettings, postMessage, location.lat, location.lng, image, peopleIds)
            .then(async res => {
                let result = await (res.json());
                if (result.success) {
                    setShow(false);
                } else {
                    //error
                }
            })
    }

    return (
        <PopUp show={show} setShow={setShow} escClose={true}>
            <div className="popup-outer make-post-popup">
                <div className="popup-inner post-popup">
                    <PopUpHeader title="Create a post" closePopUp={() => setShow(false)}></PopUpHeader>
                    <section className="make-post-underheader">
                        <div className="image">
                            <img src={loggedIn.profilePhoto} alt="" />
                        </div>
                        <span>{loggedIn.firstName} {loggedIn.lastName}</span>
                        <Select
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary25: '#595757',
                                    primary: 'rgb(212, 212, 212)',
                                    neutral0: '#3F3B3B',
                                    neutral80: 'white',
                                    neutral60: '#aaaaaa',
                                    neutral10: '#595757',
                                    dangerLight: '#523737',
                                }
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
            </div>
        </PopUp>)
}

export default MakePostPopUp;