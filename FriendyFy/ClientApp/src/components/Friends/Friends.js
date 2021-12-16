import React, { useEffect, useState } from 'react';
import Friend from '../Friend/Friend';
import './Friends.css';
import "../Profile/Profile.css"
import ProfileFriendSearch from '../ProfileFriendSearch/ProfileFriendSearch';
import { getFriends } from '../../services/friendService';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from 'react-loader-spinner';

const Friends = () => {
    const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
    const [friends, setFriends] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true);
    useEffect(() => {
        getFriends(userId, 10, 0, isSearching ? search : null)
            .then(async res => {
                let friendsObj = (await res.json()).friends;
                setTimeout(() => {
                    setFriends(friendsObj)
                }, 300);
                if (friendsObj.length === 0) {
                    setHasMore(false);
                }
                setIsFirstTime(false);
            })
    }, [userId, isSearching])

    const getMoreFriends = () => {
        if (!isSearching) {
            getFriends(userId, 10, friends.length, isSearching ? search : null)
                .then(async res => {
                    let obj = (await res.json()).friends;
                    if (obj.length > 0) {
                        setFriends(prevState => ([...prevState, ...obj]));
                    }
                    else {
                        setHasMore(false);
                    }
                })
        }
    }


    return (
        <main className="friends-main">
            <header className="friends-header">
                <h2>Friends</h2>
                <ProfileFriendSearch setSearch={setSearch} setIsSearching={setIsSearching} />
            </header>
            <InfiniteScroll
                className="profile-friends"
                dataLength={friends.length}
                next={getMoreFriends}
                hasMore={hasMore}
                loader={<Loader
                    type="TailSpin"
                    color="#50A6FA"
                    height={100}
                    width={100}
                    className="loader"
                />}
                // endMessage={
                //     // <p style={{ textAlign: 'center' }}>
                //         {/* <b>No more friends to show!</b> */}
                //     // </p>
                // }
            >
                {friends.map(friend => <Friend key={friend.username} friend={friend} />)}
            </InfiniteScroll>
        </main>)
}

export default Friends;