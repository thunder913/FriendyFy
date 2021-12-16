import React from 'react';
import MyGoogleMap from '../GoogleMap/MyGoogleMap';
import './CreatePostMap.css';

const CreatePostMap = ({location, setLocation}) => {
    return (<div className="create-post-map">
        <MyGoogleMap location={location} setLocation={setLocation}></MyGoogleMap>
    </div>)
    }

export default CreatePostMap;