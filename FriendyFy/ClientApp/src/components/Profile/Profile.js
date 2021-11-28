import React, { useEffect, useState } from 'react';
import './Profile.css';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import { useHistory } from 'react-router';
import ProfilePhotos from '../ProfilePhotos/ProfilePhotos';
import Friends from '../Friends/Friends';
import ProfileTimeline from '../ProfileTimeline/ProfileTimeline';

const Profile = () => {
    const history = useHistory();
    const [pageToShow, setPageToShow] = useState('');
    useEffect(() => {
            let currentLocation = history.location.pathname;
            if(currentLocation.includes('profile')){
                setPageToShow('timeline');
            }else if(currentLocation.includes('photos')){
                setPageToShow('photos')
            }else if(currentLocation.includes('friends')){
                setPageToShow('friends');
            }

            window.scrollTo(0, 0);
    }, [history.location])

    return(<div className="profile-top">
        <div className="profile-container">
           <ProfileHeader selected={pageToShow}/>
            {pageToShow === 'timeline' ? <ProfileTimeline/> :
            pageToShow === "photos" ? <ProfilePhotos /> :
            pageToShow === "friends" ? <Friends/> : ''}
        </div>
    </div>)
}

export default Profile;