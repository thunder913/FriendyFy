import React, { useState, useEffect } from 'react';
import './ProfilePhotos.css';
import "../Profile/Profile.css"
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';
import { getUserImages } from '../../services/userService';
import InfiniteScroll from 'react-infinite-scroll-component';
import ViewImagePopUp from '../PopUps/ViewImagePopUp/ViewImagePopUp';
import { getPostByImageId } from '../../services/postService';
import Loader from 'react-loader-spinner';

const ProfilePhotos = () => {
    const [photos, setPhotos] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
    const [showImagePopUp, setShowImagePopUp] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState('');
    const [reposts, setReposts] = useState('');
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState('');
    const [post, setPost] = useState('');
    const [isFirstTime, setIsFirstTime] = useState(true);

    const loadMorePhotos = () => {
        if (!isFirstTime) {
            return getUserImages(userId, 12, photos.length)
                .then(async res => {
                    let obj = await res.json();
                    if (obj.length > 0) {
                        setPhotos(prevState => ([...prevState, ...obj]));
                    }
                    else {
                        setHasMore(false);
                    }
                })
        }
    }

    const showImagePopUpEvent = (id) => {
        getPostByImageId(id)
            .then(async res => {
                let post = await res.json();
                setIsLiked(post.isLikedByUser);
                setLikes(post.likesCount)
                setReposts(post.repostsCount);
                setComments([]);
                setCommentsCount(post.commentsCount);
                setPost(post);
                setShowImagePopUp(true);
            })
    }

    useEffect(() => {
        setPhotos([]);
        getUserImages(userId, 12, 0)
            .then(async res => {
                let obj = await (res.json());
                if (obj.length > 0) {
                    setPhotos(obj);
                }
                else {
                    setHasMore(false);
                }
                setIsFirstTime(false)
            })
    }, [])

    return (
        <main className="photos-main">
            <ViewImagePopUp
                show={showImagePopUp}
                setShow={setShowImagePopUp}
                post={post}
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
                showRightSection={true} />
            <header className="photos-header">
                <h2>Photos</h2>
            </header>
            <InfiniteScroll
                className={"profile-photos"}
                dataLength={photos.length}
                next={loadMorePhotos}
                hasMore={hasMore}
                loader={<Loader
                    type="TailSpin"
                    color="#50A6FA"
                    height={100}
                    width={100}
                    className="loader"
                />}
                scrollableTarget="scrollableDiv"
                endMessage={
                    !photos.length ? <p style={{ textAlign: 'center' }}>
                        <b>There are no images!</b>
                    </p> : ''
                }>
                {photos.map(photo => <ProfilePhoto key={photo.imageId} showImagePopUpEvent={showImagePopUpEvent} image={photo.imageUrl} id={photo.imageId} />)}
            </InfiniteScroll>
        </main>)
}

export default ProfilePhotos;