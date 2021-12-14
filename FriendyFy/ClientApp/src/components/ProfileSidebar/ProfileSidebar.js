import React, { useState, useEffect } from 'react';
import './ProfileSidebar.css';
import { getUserLocation, getUserEventsCount, getUserImages } from '../../services/userService';
import { getFriends } from '../../services/friendService';
import { Link } from "react-router-dom";
import MapPopUp from '../PopUps/MapPopUp/MapPopUp';
import { getPostByImageId } from '../../services/postService';
import ViewImagePopUp from '../PopUps/ViewImagePopUp/ViewImagePopUp';
const ProfileSidebar = () => {
    const [location, setLocation] = useState('');
    const [sidebarFriends, setSidebarFriends] = useState({});
    const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
    const [eventsCount, setEventsCount] = useState('');
    const [photos, setPhotos] = useState([]);
    const [showMapPopUp, setShowMapPopUp] = useState(false);
    const [showImagePopUp, setShowImagePopUp] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState('');
    const [reposts, setReposts] = useState('');
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState('');
    const [post, setPost] = useState('');
    useEffect(() => {
        if(userId && window.location.href.includes('profile')){
        getFriends(userId, 9, 0)
            .then(async res => { await setSidebarFriends(await res.json()) });
        getUserLocation(userId)
            .then(async res => { setLocation((await res.json())) });
        getUserEventsCount(userId)
            .then(async res => { setEventsCount((await res.json()).count) });
        getUserImages(userId, 9, 0)
            .then(async res => setPhotos(await res.json()));
        }
    }, [userId])

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

    return (
        <div className={"profile-sidebar " + (showImagePopUp ? "popup-shown" : '')}>
            <ViewImagePopUp
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
                showRightSection={true}
                show={showImagePopUp}
                setShow={setShowImagePopUp} />
            <MapPopUp
                title="Map"
                location={location.location}
                lat={location.latitude}
                long={location.longitude}
                blockPageScroll={true}
                show={showMapPopUp}
                setShow={setShowMapPopUp} />
            <div className="user-information rounded-side">
                <h2>Info</h2>
                <div className="user-details">
                    <p className="user-location" onClick={() => setShowMapPopUp(true)}>Lives in {location.location}</p>
                    <p>Attended {eventsCount} events!</p>
                </div>
            </div>
            <div className="user-photos rounded-side">
                <header className="headline">
                    <h2><Link className="tab-title" to={`/photos/${userId}`}>Photos</Link></h2>
                    <p className="see-all-photos"><Link to={`/photos/${userId}`}>See All Photos</Link></p>
                </header>
                <div className="pictures">
                    {photos.map(photo => <div key={photo.imageId} onClick={() => showImagePopUpEvent(photo.imageId)} className="small-profile-photo">
                        <img src={photo.imageUrl} alt="" />
                    </div>)}
                </div>
            </div>
            <div className="friend-list rounded-side">
                <header className="friends-header">
                    <h2><Link className="tab-title" to={`/friends/${userId}`}>Friends</Link></h2>
                    <Link className='tab-title' to={'/friends/'+userId}>{sidebarFriends.friendsCount} friend{sidebarFriends.friendsCount === 1 ? '' : 's'}</Link>
                </header>
                <section className="friends-section">
                    {sidebarFriends.friends ? sidebarFriends.friends.map(friend =>
                        <div key={friend.username} className="friend">
                            <Link to={`/profile/${friend.username}`}>
                                <div className="friend-image">
                                    <img src={friend.profileImage} alt="" />
                                </div>
                                <p className="friend-name">{friend.fullName}</p>
                            </Link>
                        </div>) : ''}
                </section>
            </div>
        </div>
    )
}

export default ProfileSidebar;

