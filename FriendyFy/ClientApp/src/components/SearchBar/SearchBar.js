import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './SearchBar.css';
import { searchUsersAndEvents } from '../../services/searchService';

const SearchBar = () =>{
    const [peopleCount, setPeopleCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [hasMorePeople, setHasMorePeople] = useState(true);
    const [hasMoreEvents, setHasMoreEvents] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    
    return(
    <div className="search-form" >
        <form action="/" method="get">
        <input
            type="text"
            id="header-search"
            placeholder="Search FriendyFy"
            name="s" 
        />
        <div className="search-suggestions">
                {searchResults.map(res => <div className="search-result">
                <div className="result-image">
                    {/* //res.id */}
                    <img src={res.imageUrl} alt="" />
                </div>
                <p class="search-name">{res.name}</p>
            </div>)}
            
            <div className="search-result">
                <div className="result-image">
                    <img src="https://friendyfy.blob.core.windows.net/pictures/6c56fcb7-46e1-4f74-80ed-eaa522a34cc5.jpeg" alt="" />
                </div>
                <p class="search-name">UserFirstName UserLastName</p>
            </div>
        </div>
        <button className="search-button" type="submit">
        <FontAwesomeIcon icon={faSearch} />
        </button>
    </form>
    </div>)
}

export default SearchBar;