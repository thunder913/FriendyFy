import React, { useState, useEffect } from 'react';
import './ProfilePhotos.css';
import "../Profile/Profile.css"
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';
import { getUserImages } from '../../services/userService';
import InfiniteScroll from 'react-infinite-scroll-component';


const ProfilePhotos = () => {
    const [photos, setPhotos] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/')+1));
    
    const loadMorePhotos = () => {
        return getUserImages(userId, 10, photos.length)
        .then(async res => { 
            let obj = await res.json();
            if(obj.length>0){
                setPhotos(prevState => ([...prevState, ...obj]));
            }
            else{
                setHasMore(false);
            }
        })
    }

    useEffect(() => {
            getUserImages(userId, 10, 0) 
                .then(async res => {
                    let obj = await (res.json());
                    if(obj.length>0){
                        setPhotos(obj);
                    }
                    else{
                        setHasMore(false);
                    }
            })
    }, []) 

    return(
            <main className="photos-main">
                <header className="photos-header">
                    <h2>Photos</h2>
                </header>
                <InfiniteScroll
                    className={"profile-photos"}
                    dataLength={photos.length}
                    next={loadMorePhotos}
                    hasMore={hasMore}
                    loader={<h4 className="loading-text">Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                          <b>No more images available</b>
                        </p>
                      }>
                    {photos.map(photo => <ProfilePhoto image={photo.imageUrl}/>)}
                </InfiniteScroll>
            </main>)
}

export default ProfilePhotos;