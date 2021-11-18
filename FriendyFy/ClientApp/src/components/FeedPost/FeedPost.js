import React, { useEffect } from 'react';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import './FeedPost.css';

const FeedPost = ({post}) => {
    const defaultImage = "https://friendyfy.blob.core.windows.net/pictures";        

    return(
    <div className="feed-photo">
        <FeedHeader 
            photo={post.creatorImage} 
            name={post.creatorName} 
            time={post.createdAgo<2 ? "Just Now" : post.createdAgo < 60 ? post.createdAgo+" minutes ago" :
                post.createdAgo < 60 * 24 ? parseInt(post.createdAgo/60)+" hours ago" :
                post.createdAgo < 60 * 48 ? parseInt(post.createdAgo/60/24)+" days ago" : ""}/>
        {post.postMessage ? <div className="post-text">
            <p>{post.postMessage}</p>
        </div> : ""}
        {post.postImage != defaultImage ? <div className="post-image">
            <img src={post.postImage} alt="" />
        </div> : ""}
        <FeedFooter 
            postId={post.postId} 
            likes={post.likesCount} 
            comments={post.commentsCount} 
            reposts={post.repostsCount} 
            isLiked={post.isLikedByUser}/>
    </div>)
}

export default FeedPost;