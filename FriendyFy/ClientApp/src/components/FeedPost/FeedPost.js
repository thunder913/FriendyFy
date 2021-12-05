import React, { useEffect, useState } from 'react';
import FeedHeader from '../FeedHeader/FeedHeader';
import FeedFooter from '../FeedFooter/FeedFooter';
import './FeedPost.css';
import { parseTime } from '../../services/helperService';
import ViewImagePopUp from '../PopUps/ViewImagePopUp/ViewImagePopUp';
import { CSSTransition } from 'react-transition-group';

const FeedPost = ({post}) => {
    const defaultImage = "https://friendyfy.blob.core.windows.net/pictures";        
    const [showImagePopUp, setShowImagePopUp] = useState(false);
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [likes, setLikes] = useState(post.likes)
    const [reposts, setReposts] = useState(post.repostsCount)
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(post.comments);
    const [hidePost, setHidePost] = useState(false)

    const closePopUpEvent = () => {
        setShowImagePopUp(false);
    }

    useEffect(() => {
        setIsLiked(post.isLikedByUser);
        setLikes(post.likesCount);
        setCommentsCount(post.commentsCount)
    }, [post])

    return(<CSSTransition 
        in={!hidePost} 
        timeout={800} 
        classNames={"feed-post-animation"}
        unmountOnExit
        onEnter={() => setHidePost(false)}
        onExited={() => setHidePost(true)}>
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
            showRightSection={true}
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
            postType={post.postType}
            setHidePost={setHidePost}
            isCreator={post.isUserCreator}
            />
        {post.postMessage ? <div className="post-text">
            <p>{post.postMessage}</p>
        </div> : ""}
        {post.postImage != defaultImage ? <div className="post-image">
            <img onClick={() => setShowImagePopUp(true)} src={post.postImage} alt="" />
        </div> : ""}
        <FeedFooter
            repostId={post.postId}
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
            isRepost={false}
            />
    </div>
    </CSSTransition>)
}

export default FeedPost;