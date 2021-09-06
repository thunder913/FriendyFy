import React from 'react';
import './FriendSearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const FriendSearchBar = () =>(
    <div className="friend-search-form" >
        <form action="/" method="get">
        <input
            type="text"
            id="header-search"
            placeholder="Search Friends"
            name="s" 
        />
        <button className="friend-search-button" type="submit">
        <FontAwesomeIcon icon={faSearch} />
        </button>
    </form>
    </div>
    )

export default FriendSearchBar;