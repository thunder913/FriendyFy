import React, { useEffect, useState } from 'react';
import Friend from '../Friend/Friend';
import './Friends.css';
import "../Profile/Profile.css"
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfileFriendSearch from '../ProfileFriendSearch/ProfileFriendSearch';
import { getFriends } from '../../services/friendService';
import InfiniteScroll from 'react-infinite-scroll-component';
const Friends = () => {
    const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
    const [friends, setFriends] = useState([]);
    const [hasMore, setHasMore] = useState(true);    

    useEffect(() => {
        getFriends(userId, 10, 0)
            .then(async res => {
                let friendsObj = (await res.json()).friends;
                setTimeout(() => {
                    setFriends(friendsObj)                    
                }, 300);
            })
    }, [userId])

    const getMoreFriends = () => {
        getFriends(userId, 10, friends.length)
        .then(async res => {
            let obj = (await res.json()).friends;
            if(obj.length>0){ 
            setFriends(prevState => ([...prevState, ...obj]));
            }
            else{
                setHasMore(false);
            }
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
                <InfiniteScroll
                    className="profile-friends"
                    dataLength={friends.length}
                    next={getMoreFriends}
                    hasMore={hasMore}
                    loader={<h4 className="loading-text">Loading...</h4>}
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                        <b>No more friends to show!</b>
                        </p>
                    }
                    >
                    {friends.map(friend => <Friend friend={friend}></Friend>)}
                </InfiniteScroll>
            </main>
        </div>
    </div>)
}

export default Friends;