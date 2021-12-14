import React from 'react';
import './FriendSearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const FriendSearchBar = ({setSearch, performSearch}) =>(
    <div className="friend-search-form" >
        <form>
        <input
            type="text"
            id="header-search"
            placeholder="Search Friends"
            name="s" 
            onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={(e) => performSearch(e)} className="friend-search-button" type="button">
        <FontAwesomeIcon icon={faSearch} />
        </button>
    </form>
    </div>
    )

export default FriendSearchBar;