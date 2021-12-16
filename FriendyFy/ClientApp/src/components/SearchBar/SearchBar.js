import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './SearchBar.css';
import { searchUsersAndEvents } from '../../services/searchService';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router';
import OutsideClickHandler from 'react-outside-click-handler';
import Loader from 'react-loader-spinner';

const SearchBar = () =>{
    const [peopleCount, setPeopleCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [hasMorePeople, setHasMorePeople] = useState(true);
    const [hasMoreEvents, setHasMoreEvents] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [search, setSearch] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [, setIsSearching] = useState(false);
    const history = useHistory();
    // const [value] = useDebounce(search, 500);

    const performSearch = () => {
        return searchUsersAndEvents(search, 10, 0, 0)
        .then(async res => {
            let obj = await res.json();
            setSearchResults(obj.searchResults);
            setPeopleCount(obj.peopleCount);
            setEventsCount(obj.eventsCount);
            setHasMoreEvents(obj.hasMoreEvents);
            setHasMorePeople(obj.hasMorePeople);
            setIsSearching(false);
        })
    }

    const searchResultsEvent = (e) => {
        e.preventDefault();
        setIsSearching(true);
        setShowSearchResults(true);
        performSearch();
    }

    const loadMoreResults = () => {
        setIsSearching(true);
        return searchUsersAndEvents(search, 10, peopleCount, eventsCount)
        .then(async res => { 
            let obj = await res.json();
            setSearchResults(prevState => ([...prevState, ...obj.searchResults]));
            setPeopleCount(obj.peopleCount);
            setEventsCount(obj.eventsCount);
            setHasMoreEvents(obj.hasMoreEvents);
            setHasMorePeople(obj.hasMorePeople);
            setIsSearching(false);
        })
    }

    const hideSearchResults = () => {
        setShowSearchResults(false);
        setSearchResults([]);
        setPeopleCount(0);
        setEventsCount(0);
        setHasMoreEvents(true);
        setHasMorePeople(true);
    } 

    const searchResultClickEvent = (id, type) => {
        hideSearchResults();
        history.push('/'+type+'/' + id);
    }

    // useEffect(() => {
    //     if(value && !isSearching){
    //         setShowSearchResults(true);
    //         performSearch();
    //     }else{
    //         setShowSearchResults(false);
    //     }
    // }, [value])

    const onSearchInputClick = () => {
        if(search){
            setShowSearchResults(true);
            performSearch();
        }
    }

    return(
        <div className="search-form" >
    <OutsideClickHandler
        onOutsideClick={() => {
          hideSearchResults()
        }}>
        <form action="/" method="get">
        <input
            type="text"
            id="header-search"
            placeholder="Search FriendyFy"
            name="s" 
            onChange={e => setSearch(e.target.value)}
            autoComplete="off"
            onClick={onSearchInputClick}
        />
        <div className={"search-suggestions "+ (!showSearchResults ? 'hide' : '')} onBlur={hideSearchResults}>
            {showSearchResults ? <InfiniteScroll
                    className="search fancy-scroll"
                    dataLength={eventsCount+peopleCount}
                    next={loadMoreResults}
                    height={300}
                    hasMore={(hasMoreEvents || hasMorePeople)}
                    loader={<Loader
                        type="TailSpin"
                        color="#50A6FA"
                        height={50}
                        width={50}
                        className="loader"
                      />}
                    scrollableTarget="scrollableDiv"
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                          {searchResults.length ? <b>Nothing else to show</b> : <b>Nothing matched your search</b>}
                        </p>
                      }
                >
            {searchResults.map(res => <div onClick={() => searchResultClickEvent(res.id, res.type)} key={res.id} className="search-result">
            <div className="result-image">
                {/* //res.id */}
                <img src={res.imageUrl} alt="" />
            </div>
            <p className="search-name">{res.name}</p>
            </div>)}
                </InfiniteScroll>
            : ''}
        </div>
        <button className="search-button" onClick={searchResultsEvent}>
        <FontAwesomeIcon icon={faSearch} />
        </button>
    </form>
    </OutsideClickHandler>
    </div>

    )
}

export default SearchBar;