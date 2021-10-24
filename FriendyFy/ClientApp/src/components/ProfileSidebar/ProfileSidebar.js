import React, { useState, useEffect } from 'react';
import './ProfileSidebar.css';
import { getFriends, getUserLocation, getUserEventsCount } from '../../services/userService';
import { useLocation } from 'react-router';
import {Link} from "react-router-dom";

const ProfileSidebar = () =>{
const [location, setLocation] = useState('');
const [sidebarFriends, setSidebarFriends] = useState({});
const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
const [eventsCount, setEventsCount] = useState('');
const siteLocation = useLocation().pathname;

useEffect(() => {
    getFriends(userId, 9)
        .then(async res => { await setSidebarFriends(await res.json())});
    getUserLocation(userId)
        .then(async res => {setLocation((await res.json()).location)});
    getUserEventsCount(userId)
        .then(async res => {setEventsCount((await res.json()).count)});
    }, [siteLocation])

return(
<div className="profile-sidebar">
<div className="user-information rounded-side">
    <h2>Info</h2>
    <div className="user-details">
        <p>Lives in {location}</p>
        <p>Attended {eventsCount} events!</p>
    </div>
</div>
<div className="user-photos rounded-side">
    <header className="headline">
        <h2><Link className="tab-title" to={`/photos/${userId}`}>Photos</Link></h2>
        <p className="see-all-photos"><Link to={`/photos/${userId}`}>See All Photos</Link></p>
    </header>
    <div className="pictures">
        <div className="small-profile-photo">
            <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
        </div>
        <div className="small-profile-photo">
            <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
        </div>
        <div className="small-profile-photo">
            <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
        </div>
        <div className="small-profile-photo">
            <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
        </div>
        <div className="small-profile-photo">
            <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
        </div>
        <div className="small-profile-photo">
            <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
        </div>
        <div className="small-profile-photo">
            <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
        </div>
        <div className="small-profile-photo">
            <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
        </div>
        <div className="small-profile-photo">
            <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
        </div>
    </div>
    </div>
<div className="friend-list rounded-side">
    <header className="friends-header">
    <h2><Link className="tab-title" to={`/friends/${userId}`}>Friends</Link></h2>
        <span>{sidebarFriends.friendsCount} friends</span>
    </header>
    <section className="friends-section">
        {sidebarFriends.friends ? sidebarFriends.friends.map(friend =>
            <div className="friend">
                <Link to={`/profile/${friend.username}`}>
                <div className="friend-image">
                    <img src={friend.profileImage} alt="" />
                </div>
                <p className="friend-name">{friend.fullName}</p>
                </Link>
            </div>) : ''}
    </section>
</div>
<div className="user-friends">
    {/* Pass user name, photo and ID and display them on the left side */}
</div>
</div>
)}

export default ProfileSidebar;

