import React, { useState } from 'react';
import './ProfileHeader.css';
import { Link } from 'react-router-dom';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import axios from 'axios';

const ProfileHeader = ({selected}) =>{
    const {loggedIn} = useLoggedIn();
    const [profilePicture, setProfilePicture] = useState(''); 
    const [coverPicture, setCoverPicture] = useState(''); 
    const [name, setName] = useState(''); 
    const [interests, setInterests] = useState([]); 
    const [quote, setQuote] = useState(''); 
    const userId = window.location.href.substring(window.location.href.lastIndexOf('/')+1);

    useState(() => {
        axios.get("api/getUserInformation/" + userId)
        .then(async (res) => {
            let user = res.data;
            console.log(user);
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
            <Link className={"timeline " + (selected.match("timeline") ? "selected" : "")} to="profile">
                Timeline
            </Link>
        </div>
        <div className="photos-nav">
            <Link className={"photos " + (selected.match("photos-nav") ? "selected" : "")} to="photos">
                Photos
            </Link>
        </div>
        <div className="friends-nav">
            <Link className={"friends " + (selected.match("friends") ? "selected" : "")} to="friends">
                Friends
            </Link>
        </div>
        <div className="add-friend-nav">
            <a className="add-friend " href="">
                Add Friend
            </a>
        </div>
    </div>
</header>
)}

export default ProfileHeader;

      
