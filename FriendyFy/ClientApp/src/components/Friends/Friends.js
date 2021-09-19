import React from 'react';
import Friend from '../Friend/Friend';
import './Friends.css';
import "../Profile/Profile.css"
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfileFriendSearch from '../ProfileFriendSearch/ProfileFriendSearch';
const friends = [
    {
        name: "Ivan Petrov",
        image: "https://tinyurl.com/44t28uud"
    }
    , {
        name: "Ivan Petrov",
        image: "https://tinyurl.com/44t28uud",
    }, {
        name: "Ivan Petrov",
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        name: "IvanIvanPetrovPetrov Ivan Petrov Ivan Petrov",
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        name: "Ivan Petrov",
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        name: "Ivan Petrov",
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        name: "Ivan Petrov",
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        name: "Ivan Petrov",
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        name: "Ivan Petrov",
        image: "https://tinyurl.com/44t28uud",
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