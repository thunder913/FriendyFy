import React, { useEffect, useState } from 'react';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import './FeedPost.css';
import { parseTime } from '../../services/helperService';
import ViewImagePopUp from '../PopUps/ViewImagePopUp/ViewImagePopUp';
const FeedPost = ({post}) => {
    const defaultImage = "https://friendyfy.blob.core.windows.net/pictures";        
    const [showImagePopUp, setShowImagePopUp] = useState(false);

    const closePopUpEvent = () => {
        setShowImagePopUp(false);
    }

    return(
    <div className="feed-photo">
        {showImagePopUp ? <ViewImagePopUp post={post} closePopUp={closePopUpEvent}></ViewImagePopUp> : ''}
        <FeedHeader 
            photo={post.creatorImage} 
            name={post.creatorName} 
            time={parseTime(post.createdAgo)}
            username={post.username}
            city={post.locationCity}
            lat={post.latitude}
            long={post.longitude}
            taggedPeople={post.taggedPeopleCount}
            postId={post.postId}
            />
        {post.postMessage ? <div className="post-text">
            <p>{post.postMessage}</p>
        </div> : ""}
        {post.postImage != defaultImage ? <div className="post-image">
            <img onClick={() => setShowImagePopUp(true)} src={post.postImage} alt="" />
        </div> : ""}
        <FeedFooter 
            postId={post.postId} 
            likes={post.likesCount} 
            comments={post.commentsCount} 
            reposts={post.repostsCount} 
            isLiked={post.isLikedByUser}
            postType={post.postType}/>
    </div>)
}

export default FeedPost;