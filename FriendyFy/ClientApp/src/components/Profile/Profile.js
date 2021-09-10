import React from 'react';
import './Profile.css';

const Profile = () =>(
    <div className="profile-top">
        <div className="profile-container">
            <div className="cover-photo">
                <img src="http://1.bp.blogspot.com/-wqfx3ZlkHyw/T4jx7odkbQI/AAAAAAAABLE/1UF1OveYMl4/s1600/colorful%2Bmoon.png" alt="" />
            </div>
            <div className="profile-picture">
                <img src="https://scontent-sof1-1.xx.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=V3_ba1SZUj0AX8zYiPW&_nc_ht=scontent-sof1-1.xx&oh=f5dcc1bbf0701abef7059bb4e060a129&oe=615B9954" alt="" />
            </div>
        </div>
        <span>Andon Gorchov</span>
        <span className="quote">This is a quote!This is a quote!This is a quote!This is a quote!This is a quote!</span>
    </div>

)

export default Profile;