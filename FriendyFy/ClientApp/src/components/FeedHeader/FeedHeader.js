import React, { useEffect, useState } from 'react';
import './FeedHeader.css';
import PeopleListPopUp from '../PopUps/PeopleListPopUp/PeopleListPopUp'
import { getTaggedPeople } from '../../services/postService';
import MapPopUp from '../PopUps/MapPopUp/MapPopUp'
import FeedHeaderOptions from '../FeedHeaderOptions/FeedHeaderOptions';
import NotificationManager from "react-notifications/lib/NotificationManager";
import { NotificationContainer } from "react-notifications";
import { Link } from 'react-router-dom';

function FeedHeader({ photo, name, time, username, city, lat, long, taggedPeople, postId, postType, isRepost, setHidePost, isCreator }) {
    const [showPostLocation, setShowPostLocation] = useState(false);
    const [showTaggedPeople, setShowTaggedPeople] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [hasError, setHasError] = useState(false);

    const loadTaggedPeople = (skip) => {
        return getTaggedPeople(postId, skip, 10);
    }

    useEffect(() => {
        if (isDeleted) {
            if (hasError) {
                setHasError(false);
                setIsDeleted(false);
                NotificationManager.error('There was an error deleting the post!', '', 200000);
            } else {
                setHidePost(true);
            }
        }
    }, [isDeleted])



    return (
        <header className="feed-header">
            <PeopleListPopUp
                title="Tagged People"
                count={taggedPeople}
                loadPeople={loadTaggedPeople}
                show={showTaggedPeople}
                setShow={setShowTaggedPeople}
            />
            <MapPopUp
                title="Map"
                location={city}
                lat={lat}
                long={long}
                blockPageScroll={true}
                show={showPostLocation}
                setShow={setShowPostLocation} />

            <div className="header-left">
                <Link to={'/profile/' + username}>
                    <div className="post-creator-image">
                        <img src={photo} alt="" />
                    </div>
                </Link>
                <div className="header-user-data">
                    <div className="upper-post-data">
                        <Link to={'/profile/' + username}>
                            <h3>{name}</h3>
                        </Link>
                        {city != null ? <p className="post-location"> is at <button onClick={() => setShowPostLocation(true)}>{city}</button></p> : ''}
                        {taggedPeople && taggedPeople != 0 ? <p>with <button onClick={() => setShowTaggedPeople(true)}> {taggedPeople} {taggedPeople == 1 ? 'person' : 'people'} </button></p> : ''}

                    </div>
                    <span>{time}</span>
                </div>
            </div>
            {(!isRepost && isCreator) ? <div className="header-right">
                <FeedHeaderOptions
                    showOptions={showOptions}
                    setIsDeleted={setIsDeleted}
                    setShowOptions={setShowOptions}
                    setHasError={setHasError}
                    postId={postId}
                    postType={postType} />
            </div> : ''}

        </header>)
}



export default FeedHeader;