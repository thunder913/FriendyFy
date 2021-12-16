import axios from 'axios';
import React, { useEffect, useState } from 'react';
import UserFriendButton from '../UserFriendButton/UserFriendButton';
import ViewImagePopUp from '../PopUps/ViewImagePopUp/ViewImagePopUp';
import './ProfileHeader.css';
import { Link } from 'react-router-dom';
const ProfileHeader = ({ selected }) => {
    const [profilePicture, setProfilePicture] = useState('');
    const [coverPicture, setCoverPicture] = useState('');
    const [name, setName] = useState('');
    const [interests, setInterests] = useState([]);
    const [quote, setQuote] = useState('');
    const [imagePopUpUrl, setImagePopUpUrl] = useState('');
    const [showImagePopUp, setShowImagePopUp] = useState(false);
    const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));

    const showProfileImage = () => {
        setImagePopUpUrl({ postImage: profilePicture })
        setShowImagePopUp(true);
    }

    const showCoverImage = () => {
        setImagePopUpUrl({ postImage: coverPicture })
        setShowImagePopUp(true);
    }

    useEffect(() => {
        let location = window.location.pathname;
        if (userId && (location.includes('profile') || location.includes('friends') || location.includes('photos'))) {
            axios.get("api/getUserInformation/" + userId)
                .then(async (res) => {
                    let user = res.data;
                    await setProfilePicture(user.profileImage);
                    await setCoverPicture(user.coverImage);
                    await setName(user.firstName + ' ' + user.lastName);
                    await setInterests(user.interests);
                    await setQuote(user.quote);
                })
        }
    }, [userId])

    return (
        <header className="profile-header">
            <ViewImagePopUp
                showRightSection={false}
                post={imagePopUpUrl}
                show={showImagePopUp}
                setShow={setShowImagePopUp} />
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
                    <Link to={'/profile/' + userId} className={"timeline " + (selected.match("timeline") ? "selected" : "")}>
                        Timeline
                    </Link>
                </div>
                <div className="photos-nav">
                    <Link to={'/photos/' + userId} className={"photos " + (selected.match("photos") ? "selected" : "")}>
                        Photos
                    </Link>
                </div>
                <div className="friends-nav">
                    <Link to={'/friends/' + userId} className={"friends " + (selected.match("friends") ? "selected" : "")}>
                        Friends
                    </Link>
                </div>
                <UserFriendButton userId={userId} />
            </div>
        </header>
    )
}

export default ProfileHeader;


