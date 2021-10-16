import React from 'react';
import './Profile.css';
import FeedEvent from '../FeedEvent/FeedEvent';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import FeedPost from '../FeedPost/FeedPost';
import { useLocation } from 'react-router';

const events = [
    {
        name: "Event_Name1",
        location: 'Plaza Disco',
        time: '23.05.2021 at 22:00',
        interests: ['Rakiya', 'Drinking', 'Dance', 'Fun', 'Rakiya', 'Drinking', 'Dance', 'Fun', 'Drinking', 'Dance', 'Fun'],
        attending: [
            { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
    },
    {
        name: "Event_Name2",
        location: 'Plaza Disco',
        time: '23.05.2021 at 22:00',
        interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
        attending: [
            { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
    },
    {
        name: "Event_Name3",
        location: 'Plaza Disco',
        time: '23.05.2021 at 22:00',
        interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
        attending: [
            { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
    },
    {
        name: "Event_Name4",
        location: 'Plaza Disco',
        time: '23.05.2021 at 22:00',
        interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
        attending: [
            { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
            { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
    }
]

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

const Profile = () => {
    return(<div className="profile-top">
        <div className="profile-container">
           <ProfileHeader selected="timeline"/>
             <main className="profile-main">
             <ProfileSidebar friends={friends}/>
                <div className="profile-feed">
                    <div className="feed">
                    {events.map(event => <FeedEvent event={event} />)}
                        <FeedPost image="/static/media/testPhoto.c8119cb6.jpg"></FeedPost>
                        <FeedPost image="http://www.orneveien.org/nikon-d800/panoramas/huge/2015-02-06-wellville-mountains-gleaming-new-snow-panorama-halfsize.jpg"></FeedPost>
                        <FeedPost image="https://jillsbooks.files.wordpress.com/2011/02/abraham-lincoln-was-very-tall.jpg"></FeedPost>
                    </div>
                </div>
            </main>
        </div>
    </div>)
}

export default Profile;