import React from 'react';
import './ProfilePhotos.css';
import "../Profile/Profile.css"
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';

const photos = [
    {
        image: "/static/media/testPhoto.c8119cb6.jpg"
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }, {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    },
    {
        image: "/static/media/testPhoto.c8119cb6.jpg"
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }, {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "http://www.orneveien.org/nikon-d800/panoramas/huge/2015-02-06-wellville-mountains-gleaming-new-snow-panorama-halfsize.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
    , {
        image: "/static/media/testPhoto.c8119cb6.jpg",
    }
]


const ProfilePhotos = () => (
    <div className="profile-top">
        <div className="profile-container">
            <ProfileHeader selected="photos-nav" />
            <main className="photos-main">
                <header className="photos-header">
                    <h2>Photos</h2>
                </header>
                <div className="profile-photos">
                    {photos.map(photo => <ProfilePhoto image={photo.image}/>)}
                </div>
            </main>
        </div>
    </div>
)

export default ProfilePhotos;