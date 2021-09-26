import React from 'react';
import './ProfilePhotos.css';
import "../Profile/Profile.css"
import ProfileHeader from '../ProfileHeader/ProfileHeader';
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';

const photos = [
    {
        image: "https://tinyurl.com/44t28uud"
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }, {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    },
    {
        image: "https://tinyurl.com/44t28uud"
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }, {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "http://www.orneveien.org/nikon-d800/panoramas/huge/2015-02-06-wellville-mountains-gleaming-new-snow-panorama-halfsize.jpg",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
    }
    , {
        image: "https://tinyurl.com/44t28uud",
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