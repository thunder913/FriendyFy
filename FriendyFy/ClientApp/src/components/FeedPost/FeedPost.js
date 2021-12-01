import React, { useEffect, useState } from 'react';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import './FeedPost.css';
import { parseTime } from '../../services/helperService';
import ViewImagePopUp from '../PopUps/ViewImagePopUp/ViewImagePopUp';
const FeedPost = ({post}) => {
    const defaultImage = "https://friendyfy.blob.core.windows.net/pictures";        
    const [showImagePopUp, setShowImagePopUp] = useState(false);
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likes, setLikes] = useState(post.likes)
    const [reposts, setReposts] = useState(post.repostsCount)
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(post.comments);
    
    const closePopUpEvent = () => {
        setShowImagePopUp(false);
    }

    useEffect(() => {
        setIsLiked(post.isLikedByUser);
        setLikes(post.likesCount);
        setCommentsCount(post.commentsCount)
    }, [post])

    return(
    <div className="feed-photo">
        {showImagePopUp ? <ViewImagePopUp 
            post={post} 
            closePopUp={closePopUpEvent}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            likes={likes}
            setLikes={setLikes}
            comments={comments}
            setComments={setComments}
            commentsCount={commentsCount}
            setCommentsCount={setCommentsCount}
            reposts={reposts} 
            setReposts={setReposts}
            ></ViewImagePopUp> : ''}
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
            postType={post.postType}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            likes={likes}
            setLikes={setLikes}
            comments={comments}
            setComments={setComments}
            commentsCount={commentsCount}
            setCommentsCount={setCommentsCount}
            reposts={reposts} 
            setReposts={setReposts}
            />
    </div>)
}

export default FeedPost;