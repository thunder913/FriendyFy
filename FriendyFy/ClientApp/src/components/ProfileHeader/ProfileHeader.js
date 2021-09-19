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
            <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
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

      
