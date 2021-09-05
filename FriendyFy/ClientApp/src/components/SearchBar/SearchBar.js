import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './SearchBar.css';

const SearchBar = () =>(
    <div className="search-form" >
        <form action="/" method="get">
        <input
            type="text"
            id="header-search"
            placeholder="Search FriendyFy"
            name="s" 
        />
        <button className="search-button" type="submit">
        <FontAwesomeIcon icon={faSearch} />
        </button>
    </form>
    </div>
    )

export default SearchBar;