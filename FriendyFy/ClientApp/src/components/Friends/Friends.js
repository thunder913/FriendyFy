import React, { useEffect, useState } from 'react';
import Friend from '../Friend/Friend';
import './Friends.css';
import "../Profile/Profile.css"
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfileFriendSearch from '../ProfileFriendSearch/ProfileFriendSearch';
import { getFriends } from '../../services/friendService';

const Friends = () => {
    const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
    const [friends, setFriends] = useState([]);
        
    useEffect(() => {
        getFriends(userId, 10, 0)
            .then(async res => {
                setFriends((await res.json()).friends)
            })
    }, [])

    const getMoreFriends = () => {
        getFriends(userId, 10, friends.length)
        .then(async res => {
            let obj = await res.json(); 
            setFriends(prevState => ({friends: [...prevState.friends, ...obj.friends]}));
            })
        }


    return (<div className="profile-top">
        <div className="profile-container">
            <ProfileHeader selected="friends" />
            <main className="friends-main">
                <header className="friends-header">
                    <h2>Friends</h2>
                    <ProfileFriendSearch/>
                </header>
                <div className="profile-friends">
                    {friends.map(friend => <Friend friend={friend}></Friend>)}
                </div>
            </main>
        </div>
    </div>)
}

export default Friends;