import { faImage, faThumbtack, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextareaAutosize } from '@mui/material';
import React, { useState } from 'react';
import Select from 'react-select';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import CreatePostImage from '../CreatePostImage/CreatePostImage';
import CreatePostMap from '../CreatePostMap/CreatePostMap';
import CreatePostPeople from '../CreatePostPeople/CreatePostPeople';
import './MakePostPopUp.css';

const MakePostPopUp = ({hasImage, closePopUp}) =>{
    const [showImage, setShowImage] = useState(hasImage);
    const [showPeople, setShowPeople] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [image, setImage] = useState('');
    const [people, setPeople] = useState([]);
    const { loggedIn } = useLoggedIn();

    const onPostButtonClick = () => {
        console.log(image);
    }

    return(
    <div className="make-post-popup">
        <div className="post-popup">
            <header className="make-post-header">
                <p className="make-post-title">Create a post</p>
                <button onClick={closePopUp} className="close-make-post">x</button>
            </header>
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
                      options={[{value: 'friends', label:'Friends'},{value: 'everyone', label: 'Everyone'}]}
                      defaultValue={{value: 'friends', label:'Friends'}}
                      />
            </section>
            <TextareaAutosize placeholder="What's on your mind?" id="post-message" minRows={3}/>
            <div className="create-post-buttons">
                <FontAwesomeIcon 
                title="Add an image" 
                className={"post-button-icon " + (showImage ? 'active' : '') } 
                icon={faImage}
                onClick={() => setShowImage(prev => !prev)}
                />

                <FontAwesomeIcon 
                title="Tag people" 
                className={"post-button-icon " + (showPeople ? 'active' : '') } 
                icon={faUserFriends}
                onClick={() => setShowPeople(prev => !prev)}
                />
                <FontAwesomeIcon 
                title="Add a location" 
                className={"post-button-icon " + (showMap ? 'active' : '') } 
                icon={faThumbtack}
                onClick={() => setShowMap(prev => !prev)}
                />
            </div>
            {showImage ? <CreatePostImage setImage={setImage}/> : ''}
            {showPeople ? <CreatePostPeople
                onChange={(people) => setPeople(people)}
                /> : ''}
            {showMap ? <CreatePostMap/> : ''}
            <button className="post" onClick={onPostButtonClick}>Post</button>
        </div>
    </div>)
}

export default MakePostPopUp;