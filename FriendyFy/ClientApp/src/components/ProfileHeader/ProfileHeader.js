import React, { useState } from 'react';
import './ProfileHeader.css';
import { Link } from 'react-router-dom';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import axios from 'axios';

const ProfileHeader = ({selected}) =>{
    const {loggedIn} = useLoggedIn();
    const [profilePicture, setProfilePicture] = useState(''); 
    const [coverPicture, setCoverPicture] = useState(''); 

    axios.get("api/profilePicture/" + loggedIn.userName)
        .then(async (res) => setProfilePicture(await res.data));

    axios.get("api/coverPicture/" + loggedIn.userName)
        .then(async (res) => setCoverPicture(await res.data));

    return (
    <header className="profile-header">
    <div className="cover-photo">
        <img src={coverPicture} alt="" />
    </div>
    <div className="below-cover-photo">
        <span className="quote">If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.</span>
        <div className="profile-picture">
            <img src={profilePicture} alt="" />
        </div>
        <div className="user-interests">
            <span className="user-interest">Interest</span>
            <span className="user-interest">Driving</span>
            <span className="user-interest">Drinking</span>
            <span className="user-interest">Walk</span>
            <span className="user-interest">Comp</span>
            <span className="user-interest">Programming</span>
            <span className="user-interest">Interest</span>
            <span className="user-interest">Interest</span>
            <span className="user-interest">Interest</span>
            <span className="user-interest">Interest</span>
            <span className="user-interest">Interest</span>
            <span className="user-interest">Interest</span>
            <span className="user-interest">Interest</span>
            <span className="user-interest">Interest</span>
            <span className="user-interest">Interest</span>
        </div>
    </div>
    <p className="user-name">Andon Gorchov</p>
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

      
