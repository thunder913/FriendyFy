import React from 'react';
import './Profile.css';
import FeedEvent from '../FeedEvent/FeedEvent';
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
        image: "https://tinyurl.com/44t28uud",
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
                    <a className="timeline selected" href="">
                        Timeline
                    </a>
                </div>
                <div className="photos-nav">
                    <a className="photos" href="">
                        Photos
                    </a>
                </div>
                <div className="friends-nav">
                    <a className="friends" href="">Friends</a>
                </div>
                <div className="add-friend-nav">
                    <a className="add-friend" href="">
                        Add Friend
                    </a>
                </div>
            </div>
            <main className="profile-main">
                <div className="profile-sidebar">
                    <div className="user-information rounded-side">
                        <h2>Info</h2>
                        <div className="user-details">
                            <p>Founder and CEO at <a href="">SomeBusiness</a></p>
                            <p>Former programmer at <a href="">SomeWhere</a></p>
                            <p>Studies <a href="">Компютърно и софтуерно инженерство</a> at <a href="">Технически Университет - София</a></p>
                            <p>Lives in Sandanski</p>
                            <p><a href="">LinkedInName</a></p>
                        </div>
                    </div>
                    <div className="user-photos rounded-side">
                        <header className="headline">
                            <h2>Photos</h2>
                            <p className="see-all-photos"><a href="">See All Photos</a></p>
                        </header>
                        <div className="pictures">
                            <div className="small-profile-photo">
                                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
                            </div>
                            <div className="small-profile-photo">
                                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
                            </div>
                            <div className="small-profile-photo">
                                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
                            </div>
                            <div className="small-profile-photo">
                                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
                            </div>
                            <div className="small-profile-photo">
                                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
                            </div>
                            <div className="small-profile-photo">
                                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
                            </div>
                            <div className="small-profile-photo">
                                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
                            </div>
                            <div className="small-profile-photo">
                                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
                            </div>
                            <div className="small-profile-photo">
                                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
                            </div>
                        </div></div>
                    <div className="friend-list rounded-side">
                        <header className="friends-header">
                            <h2>Friends</h2>
                            <span>123 friends</span>
                        </header>
                        <section className="friends-section">
                            {friends.map(friend =>
                                <div className="friend">
                                    <div className="friend-image">
                                        <img src={friend.image} alt="" />
                                    </div>
                                    <p className="friend-name">{friend.name}</p>
                                </div>)}
                        </section>
                    </div>
                    <div className="user-friends">
                        {/* Pass user name, photo and ID and display them on the left side */}
                    </div>
                </div>
                <div className="profile-feed">
                    <div className="feed">
                        {events.map(event => <FeedEvent event={event} />)}
                    </div>
                </div>

            </main>
        </div>
    </div>

)

export default Profile;