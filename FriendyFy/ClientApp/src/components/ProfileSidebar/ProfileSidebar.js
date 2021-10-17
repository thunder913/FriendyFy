import React from 'react';
import './ProfileSidebar.css';

const ProfileSidebar = ({friends}) =>(
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
)

export default ProfileSidebar;

