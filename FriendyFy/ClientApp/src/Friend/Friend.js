import React from 'react';
import './Friend.css';

const Friend = ({friend}) =>(
    <div className="profile-friend">
    <div className="friend-image">
        <img src={friend.image} alt="" />
    </div>
    <span className="friend-name">
        {friend.name}
    </span>
    <span className="mutual-friends">
        {/* {friend.friends.length}*/}3 mutual friends
    </span>
</div>
)

export default Friend;

      
