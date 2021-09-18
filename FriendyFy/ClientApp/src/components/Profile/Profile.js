import React from 'react';
import './Profile.css';
import FeedEvent from '../FeedEvent/FeedEvent';
import Friends from '../Friends/Friends'
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
const events = [
    {
        name: "Event_Name1",
        location: 'Plaza Disco',
        time: '23.05.2021 at 22:00',
        interests: ['Rakiya', 'Drinking', 'Dance', 'Fun', 'Rakiya', 'Drinking', 'Dance', 'Fun', 'Drinking', 'Dance', 'Fun'],
        attending: [
            { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
            { name: "Petran", photo: "https://tinyurl.com/44t28uud" },
            { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
            { name: "Petran", photo: "https://tinyurl.com/44t28uud" },
            { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
            { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
    },
    {
        name: "Event_Name2",
        location: 'Plaza Disco',
        time: '23.05.2021 at 22:00',
        interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
        attending: [
            { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
    },
    {
        name: "Event_Name3",
        location: 'Plaza Disco',
        time: '23.05.2021 at 22:00',
        interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
        attending: [
            { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
            { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
    },
    {
        name: "Event_Name4",
        location: 'Plaza Disco',
        time: '23.05.2021 at 22:00',
        interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
        attending: [
            { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
            { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
            { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
    }
]

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

const Profile = () => (
    <div className="profile-top">
        <div className="profile-container">
           <ProfileHeader/>
             <main className="profile-main">
                 <ProfileSidebar friends={friends}/>
                <div className="profile-feed">
                    <div className="feed">
                        {events.map(event => <FeedEvent event={event} />)}
                    </div>
                    <div className="friends">
                        <Friends friends={friends}/>
                    </div>
                </div>
            </main>
        </div>
    </div>

)

export default Profile;