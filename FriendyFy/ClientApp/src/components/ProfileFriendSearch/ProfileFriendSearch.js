import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './ProfileFriendSearch.css';

const ProfileFriendSearch = ({setSearch, setIsSearching}) =>{
    
    const changeInput = (e) => {
        setIsSearching(false);
        setSearch(e.target.value);
    }

    return(<div className="friend-search" >
        <form>
        <input
            type="text"
            id="friend-search"
            placeholder="Search for friends"
            name="s" 
            onChange={changeInput}
        />
        <button className="friend-search-button" type="submit" onClick={(e) => {e.preventDefault(); setIsSearching(true)}}>
        <FontAwesomeIcon icon={faSearch} />
        </button>
    </form>
    </div>)
}

export default ProfileFriendSearch;