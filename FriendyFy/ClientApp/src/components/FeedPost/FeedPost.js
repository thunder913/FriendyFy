import React from 'react';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import './FeedPost.css';

const FeedPost = ({image, text}) => {
    return(
    <div className="feed-photo">
        <FeedHeader photo="https://tinyurl.com/44t28uud" name="Andon Gorchov" time="37m"/>
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