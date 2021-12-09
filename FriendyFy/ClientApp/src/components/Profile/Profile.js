import React, { useEffect, useState } from 'react';
import './Profile.css';
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import { useHistory } from 'react-router';
import ProfilePhotos from '../ProfilePhotos/ProfilePhotos';
import Friends from '../Friends/Friends';
import ProfileTimeline from '../ProfileTimeline/ProfileTimeline';
import { motion } from "framer-motion/dist/es/index.js";

const Profile = () => {
    const history = useHistory();
    const [pageToShow, setPageToShow] = useState('');
    useEffect(() => {
        let currentLocation = history.location.pathname;
        if (currentLocation.includes('profile')) {
            setPageToShow('timeline');
        } else if (currentLocation.includes('photos')) {
            setPageToShow('photos')
        } else if (currentLocation.includes('friends')) {
            setPageToShow('friends');
        }

        window.scrollTo(0, 0);
    }, [history.location])

    return (
        <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{duration: 0.2}}>
                <div className="profile-top">
                <div className="profile-container">
                    <ProfileHeader selected={pageToShow} />
                    {pageToShow === 'timeline' ? <ProfileTimeline /> :
                        pageToShow === "photos" ? <ProfilePhotos /> :
                            pageToShow === "friends" ? <Friends /> : ''}
                </div>
            </div>
        </motion.div>)
}

export default Profile;