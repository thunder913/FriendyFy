import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './ProfileFriendSearch.css';

const ProfileFriendSearch = () =>(
    <div className="friend-search" >
        <form action="/" method="get">
        <input
            type="text"
            id="friend-search"
            placeholder="Search FriendyFy"
            name="s" 
        />
        <button className="search-button" type="submit">
        <FontAwesomeIcon icon={faSearch} />
        </button>
    </form>
    </div>
    )

export default ProfileFriendSearch;