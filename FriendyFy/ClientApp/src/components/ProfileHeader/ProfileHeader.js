import React from 'react';
import './ProfileHeader.css';
import { Link } from 'react-router-dom';
const ProfileHeader = ({selected}) =>(
    <header className="profile-header">
    <div className="cover-photo">
        <img src="http://1.bp.blogspot.com/-wqfx3ZlkHyw/T4jx7odkbQI/AAAAAAAABLE/1UF1OveYMl4/s1600/colorful%2Bmoon.png" alt="" />
    </div>
    <div className="below-cover-photo">
        <span className="quote">If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.</span>
        <div className="profile-picture">
            <img src="/static/media/testPhoto.c8119cb6.jpg" alt="" />
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
)

export default ProfileHeader;

      
