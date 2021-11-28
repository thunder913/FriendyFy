import React, { useState, useEffect } from 'react';
import './ProfileSidebar.css';
import { getUserLocation, getUserEventsCount, getUserImages } from '../../services/userService';
import { getFriends } from '../../services/friendService';
import { useLocation } from 'react-router';
import {Link} from "react-router-dom";

const ProfileSidebar = () =>{
const [location, setLocation] = useState('');
const [sidebarFriends, setSidebarFriends] = useState({});
const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
const [eventsCount, setEventsCount] = useState('');
const [photos, setPhotos] = useState([]);
const siteLocation = useLocation().pathname;

useEffect(() => {
    getFriends(userId, 9, 0)
        .then(async res => { await setSidebarFriends(await res.json())});
    getUserLocation(userId)
        .then(async res => {setLocation((await res.json()).location)});
    getUserEventsCount(userId)
        .then(async res => {setEventsCount((await res.json()).count)});
    getUserImages(userId, 9, 0)
        .then(async res => setPhotos(await res.json()));
    }, [siteLocation, userId])

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
        {photos.map(photo => <div className="small-profile-photo">
            <img src={photo.imageUrl} alt="" />
        </div>)}
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

