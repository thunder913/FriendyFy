import React, { useState } from 'react';
import './ProfileHeader.css';
import { Link } from 'react-router-dom';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import axios from 'axios';
import { useLocation } from 'react-router';
import { useHistory } from 'react-router';

const ProfileHeader = ({selected}) =>{
    const {loggedIn} = useLoggedIn();
    const [profilePicture, setProfilePicture] = useState(''); 
    const [coverPicture, setCoverPicture] = useState(''); 
    const [name, setName] = useState(''); 
    const [interests, setInterests] = useState([]); 
    const [quote, setQuote] = useState(''); 
    const userId = window.location.href.substring(window.location.href.lastIndexOf('/')+1);
    const location = useLocation().pathname;
    const history = useHistory();

    const goToPhotos = () => {
        if(!location.includes("photos")){
            history.push('/photos/' + userId);
        }
    }

    const goToTimeline = () => {
        if(!location.includes("profile")){
            history.push('/profile/' + userId);
        }
    }
    
    const goToFriends = () => {
        if(!location.includes("friends")){
            history.push('/friends/' + userId);
        }
    }

    useState(() => {
        axios.get("api/getUserInformation/" + userId)
        .then(async (res) => {
            let user = res.data;
            await setProfilePicture(user.profileImage);
            await setCoverPicture(user.coverImage);
            await setName(user.firstName + ' ' + user.lastName);
            await setInterests(user.interests);
            await setQuote(user.quote);
        })
    }, [])


    return (
    <header className="profile-header">
    <div className="cover-photo">
        <img src={coverPicture} alt="" />
    </div>
    <div className="below-cover-photo">
        <span className="quote">{quote}</span>
        <div className="profile-picture">
            <img src={profilePicture} alt="" />
        </div>
        <div className="user-interests">
            {interests.map(interest => <span className="user-interest" data-id={interest.id}>{interest.label}</span>)}
        </div>
    </div>
    <p className="user-name">{name}</p>
    <div className="profile-navigation">
        <div className="timeline-nav">
            <a className={"timeline " + (selected.match("timeline") ? "selected" : "")} onClick={goToTimeline}>
                Timeline
            </a>
        </div>
        <div className="photos-nav">
            <a className={"photos " + (selected.match("photos-nav") ? "selected" : "")} onClick={goToPhotos}>
                Photos
            </a>
        </div>
        <div className="friends-nav">
            <a className={"friends " + (selected.match("friends") ? "selected" : "")} onClick={goToFriends}>
                Friends
            </a>
        </div>
        {userId === loggedIn.userName ? '' :
        <div className="add-friend-nav">
            <a className="add-friend " onClick={addFriend}>
                Add Friend
            </a>
        </div>}
    </div>
</header>
)}

export default ProfileHeader;

      
