import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import UserFriendButton from '../UserFriendButton/UserFriendButton';
import './ProfileHeader.css';
const ProfileHeader = ({selected}) =>{
    const [profilePicture, setProfilePicture] = useState(''); 
    const [coverPicture, setCoverPicture] = useState(''); 
    const [name, setName] = useState(''); 
    const [interests, setInterests] = useState([]); 
    const [quote, setQuote] = useState(''); 
    const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
    const location = useLocation().pathname;
    const history = useHistory();

    const goToPhotos = (e) => {
        if(!location.includes("photos")){
            history.push('/photos/' + userId);
        }
    }

    const goToTimeline = (e) => {
        e.preventDefault();
        if(!location.includes("profile")){
            history.push('/profile/' + userId);
        }
    }
    
    const goToFriends = (e) => {
        e.preventDefault();
        if(!location.includes("friends")){
            history.push('/friends/' + userId);
        }
    }

    useEffect(() => {
        axios.get("api/getUserInformation/" + userId)
        .then(async (res) => {
            let user = res.data;
            await setProfilePicture(user.profileImage);
            await setCoverPicture(user.coverImage);
            await setName(user.firstName + ' ' + user.lastName);
            await setInterests(user.interests);
            await setQuote(user.quote);
        })

    }, [location, userId])

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
            {interests.map(interest => <span className="user-interest" key={interest.id} data-id={interest.id}>{interest.label}</span>)}
        </div>
    </div>
    <p className="user-name">{name}</p>
    <div className="profile-navigation">
        <div className="timeline-nav">
            <button className={"timeline " + (selected.match("timeline") ? "selected" : "")} onClick={goToTimeline}>
                Timeline
            </button>
        </div>
        <div className="photos-nav">
            <button className={"photos " + (selected.match("photos-nav") ? "selected" : "")} onClick={goToPhotos}>
                Photos
            </button>
        </div>
        <div className="friends-nav">
            <button className={"friends " + (selected.match("friends") ? "selected" : "")} onClick={goToFriends}>
                Friends
            </button>
        </div>
        <UserFriendButton userId={userId}/>
    </div>
</header>
)}

export default ProfileHeader;

      
