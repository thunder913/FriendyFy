import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import UserFriendButton from '../UserFriendButton/UserFriendButton';
import ViewImagePopUp from '../PopUps/ViewImagePopUp/ViewImagePopUp';
import './ProfileHeader.css';
import { Link } from 'react-router-dom';
const ProfileHeader = ({selected}) =>{
    const [profilePicture, setProfilePicture] = useState(''); 
    const [coverPicture, setCoverPicture] = useState(''); 
    const [name, setName] = useState(''); 
    const [interests, setInterests] = useState([]); 
    const [quote, setQuote] = useState(''); 
    const [imagePopUpUrl, setImagePopUpUrl] = useState('');
    const [showImagePopUp, setShowImagePopUp] = useState(false);
    const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
    const location = useLocation().pathname;
    const history = useHistory();

    const goToPhotos = (e) => {
        e.preventDefault();
        if(!location.includes("photos")){
            history.push('/photos/' + userId);
        }
    }

    const goToTimeline = (e) => {
        e.preventDefault();
        if(!location.includes("profile")){
            history.push('/profile/' + userId);
        }
    }
    
    const goToFriends = (e) => {
        e.preventDefault();
        if(!location.includes("friends")){
            history.push('/friends/' + userId);
        }
    }

    const showProfileImage = () => {
        setImagePopUpUrl({postImage: profilePicture})
        setShowImagePopUp(true);
    }

    const showCoverImage = () => {
        setImagePopUpUrl({postImage: coverPicture})
        setShowImagePopUp(true);
    }
    
    useEffect(() => {
        axios.get("api/getUserInformation/" + userId)
        .then(async (res) => {
            let user = res.data;
            await setProfilePicture(user.profileImage);
            await setCoverPicture(user.coverImage);
            await setName(user.firstName + ' ' + user.lastName);
            await setInterests(user.interests);
            await setQuote(user.quote);
        })

    }, [location, userId])

    return (
    <header className="profile-header">
    <ViewImagePopUp
    showRightSection={false} 
    post={imagePopUpUrl}
    show={showImagePopUp}
    setShow={setShowImagePopUp}/> 
    <div className="cover-photo" onClick={showCoverImage}>
        <img src={coverPicture} alt="" />
    </div>
    <div className="below-cover-photo">
        <span className="quote">{quote}</span>
        <div className="profile-picture" onClick={showProfileImage}>
            <img src={profilePicture} alt="" />
        </div>
        <div className="user-interests">
            {interests.map(interest => <Link to={`/search-page?interests=[{"label":"${interest.label}","value":${interest.id}}]`} className="user-interest" key={interest.id} data-id={interest.id}>{interest.label}</Link>)}
        </div>
    </div>
    <p className="user-name">{name}</p>
    <div className="profile-navigation">
        <div className="timeline-nav">
            <button className={"timeline " + (selected.match("timeline") ? "selected" : "")} onClick={goToTimeline}>
                Timeline
            </button>
        </div>
        <div className="photos-nav">
            <button className={"photos " + (selected.match("photos") ? "selected" : "")} onClick={goToPhotos}>
                Photos
            </button>
        </div>
        <div className="friends-nav">
            <button className={"friends " + (selected.match("friends") ? "selected" : "")} onClick={goToFriends}>
                Friends
            </button>
        </div>
        <UserFriendButton userId={userId}/>
    </div>
</header>
)}

export default ProfileHeader;

      
