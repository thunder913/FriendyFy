import React from 'react';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import './FeedPost.css';

const FeedPost = ({image, text}) => {
    return(
    <div className="feed-photo">
        <FeedHeader photo="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" name="Andon Gorchov" time="37m"/>
        {text ? <div className="post-text">
            <p>{text}</p>
        </div> : ""}
        {image ? <div className="post-image">
            <img src={image} alt="" />
        </div> : ""}
        <FeedFooter likes="5" comments="10" reposts="20"/>
    </div>)
}

export default FeedPost;