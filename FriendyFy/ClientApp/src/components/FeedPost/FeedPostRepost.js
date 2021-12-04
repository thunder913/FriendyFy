import React, { useEffect, useState } from 'react';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import './FeedPost.css';
import { parseTime } from '../../services/helperService';
import ViewImagePopUp from '../PopUps/ViewImagePopUp/ViewImagePopUp';
const FeedPostRepost = ({post}) => {

    const defaultImage = "https://friendyfy.blob.core.windows.net/pictures";        
    const [showImagePopUp, setShowImagePopUp] = useState(false);
    const [isLiked, setIsLiked] = useState(post.isLikedByUser);
    const [likes, setLikes] = useState(post.likes)
    const [reposts, setReposts] = useState(post.repostsCount)
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(post.comments);
    
    //actual post
    const [originalIsLiked, setOriginalIsLiked] = useState(post.repost.isLikedByUser);
    const [originalLikes, setOriginalLikes] = useState(post.repost.likes);
    const [originalReposts, setOriginalReposts] = useState(post.repost.repostsCount);
    const [originalComments, setOriginalComments] = useState([]);
    const [originalCommentsCount, setOriginalCommentsCount] = useState(post.repost.commentsCount);
    const closePopUpEvent = () => {
        setShowImagePopUp(false);
    }

    useEffect(() => {
        setIsLiked(post.isLikedByUser);
        setLikes(post.likesCount);
        setCommentsCount(post.commentsCount);

        setOriginalIsLiked(post.repost.isLikedByUser);
        setOriginalLikes(post.repost.likesCount);
        setOriginalCommentsCount(post.repost.commentsCount)
    }, [post])
    return(
        <div className={"feed-photo " + (post.isRepost ? 'repost' : '')}>
            {showImagePopUp ? <ViewImagePopUp 
                post={post.repost} 
                closePopUp={closePopUpEvent}
                isLiked={originalIsLiked}
                setIsLiked={setOriginalIsLiked}
                likes={originalLikes}
                setLikes={setOriginalLikes}
                comments={originalComments}
                setComments={setOriginalComments}
                commentsCount={originalCommentsCount}
                setCommentsCount={setOriginalCommentsCount}
                reposts={originalReposts} 
                setReposts={setOriginalReposts}
                showRightSection={true}
                ></ViewImagePopUp> : ''}
            <FeedHeader
                photo={post.creatorImage} 
                name={post.creatorName} 
                time={parseTime(post.createdAgo)}
                username={post.username}
                postId={post.postId}
                />
                <div className="inner-post">
            {post.postMessage ? <span className="repost-text">{post.postMessage}</span> : ''}
            <FeedHeader
                photo={post.repost.creatorImage} 
                name={post.repost.creatorName} 
                time={parseTime(post.repost.createdAgo)}
                username={post.repost.username}
                city={post.repost.locationCity}
                lat={post.repost.latitude}
                long={post.repost.longitude}
                taggedPeople={post.repost.taggedPeopleCount}
                postId={post.repost.postId}
                isRepost={true}
                />
            {post.repost.postMessage ? <div className="post-text">
                <p>{post.repost.postMessage}</p>
            </div> : ""}
            {post.repost.postImage != defaultImage ? <div className="post-image">
                <img onClick={() => setShowImagePopUp(true)} src={post.repost.postImage} alt="" />
            </div> : ""}
            </div>
            <FeedFooter 
                repostId={post.repost.postId}
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

export default FeedPostRepost;