import React from 'react';
import Friend from '../Friend/Friend';
import './Friends.css';
import "../Profile/Profile.css"
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfileFriendSearch from '../ProfileFriendSearch/ProfileFriendSearch';
const friends = [
    {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg"
    }
    , {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }, {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        name: "IvanIvanPetrovPetrov Ivan Petrov Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
]

const Friends = () => (
    <div className="profile-top">
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
    </div>
)

export default Friends;