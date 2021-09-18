import React from 'react';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import './FeedPhoto.css';

const FeedPhoto = ({image}) => {
    return(
    <div className="feed-photo">
        <FeedHeader photo="https://tinyurl.com/44t28uud" name="Andon Gorchov" time="37m"/>
        <div className="post-image">
            <img src={image} alt="" />
        </div>
        <FeedFooter likes="5" comments="10" reposts="20"/>
    </div>)
}

export default FeedPhoto;