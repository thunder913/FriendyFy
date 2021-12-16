import React, { useEffect, useState } from "react";
import PageLoading from "../PageLoading/PageLoading";
import './SearchPage.css'
import Datetime from 'react-datetime';
import InterestsDropdown from "../InterestsDropdown/InterestsDropdown";
import moment from "moment";
import { RadioGroup, FormControlLabel, Radio, FormControl, Checkbox } from "@mui/material";
import { performSearchPageSearch } from "../../services/searchService";
import SearchPageResults from "../SearchPageResults/SearchPageResults";
import { useLocation } from "react-router";

const SearchPage = () => {
    const location = useLocation();
    const [peopleCount, setPeopleCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [feed, setFeed] = useState([]);
    const [hasMorePeople, setHasMorePeople] = useState(false);
    const [hasMoreEvents, setHasMoreEvents] = useState(false);

    const [searchWord, setSearchWord] = useState('');
    const [type, setType] = useState('Both');
    const [interests, setInterests] = useState([]);
    const [onlyYourEvents, setOnlyYourEvents] = useState(false);
    const [momentDate, setMomentDate] = useState('');


    const [currentSearchWord, setCurrentSearchWord] = useState('');
    const [currentType, setCurrentType] = useState('Both');
    const [currentInterests, setCurrentInterests] = useState([]);
    const [currentOnlyYourEvents, setCurrentOnlyYourEvents] = useState(false);
    const [currentMomentDate, setCurrentMomentDate] = useState('');

    function getCurrentLocalization() {
        let localization = window.navigator.userLanguage || window.navigator.language;
        moment.locale(localization);
        return moment.locale();
    }

    const onDateChangeHandler = (e) => {
        setMomentDate(e._d);
    }

    const performSearch = (searchWord, type, interests, onlyYourEvents, momentDate, skipPeople, skipEvents, isSearchButtonClicked) => {
        performSearchPageSearch(searchWord, type,
            JSON.stringify(interests.map(x => ({ label: x.label, id: Number.isInteger(x.value) ? x.value : 0, isNew: x.__isNew__ ?? false }))),
            onlyYourEvents, moment(momentDate).format("DD/MM/YYYY"), 20, skipPeople, skipEvents)
            .then(res => res.json())
            .then(data => {
                setEventsCount(data.eventsCount);
                setPeopleCount(data.peopleCount);
                setHasMoreEvents(data.hasMoreEvents);
                setHasMorePeople(data.hasMorePeople);
                if(isSearchButtonClicked){
                    setFeed(data.searchResults);
                }else{
                    setFeed(prev => ([...prev, ...data.searchResults]));
                }
            });
    }

    const onButtonClick = (e) => {
        e.preventDefault();
        setEventsCount(0);
        setPeopleCount(0);
        setHasMoreEvents(true);
        setHasMorePeople(true);

        setCurrentInterests(interests);
        setCurrentMomentDate(momentDate);
        setCurrentOnlyYourEvents(onlyYourEvents);
        setCurrentType(type);
        setCurrentSearchWord(searchWord);

        performSearch(searchWord, type, interests, onlyYourEvents, momentDate, 0, 0, true);
    }

    const loadMoreResults = () => {
        return performSearch(searchWord, type, interests, onlyYourEvents, momentDate, peopleCount, eventsCount, false);
    }

    useEffect(() => {
        if (type === 'Person') {
            setOnlyYourEvents(false);
        }
    }, [type])

    useEffect(() => {
        const queryString = require('query-string');
        const parsed = queryString.parse(location.search);
        if (parsed) {
            let interests = [];
            if (parsed.interests) {
                interests = JSON.parse(parsed.interests);
                setInterests(interests);
            }
            const isOnlyUserEvents = parsed.onlyUserEvents === "true";
            setOnlyYourEvents(isOnlyUserEvents);
            performSearch(searchWord, type, interests, isOnlyUserEvents, momentDate, 0, 0, true);
        }
    }, [location])


    return (<PageLoading>
        <div className="search-page">
            <form className="search-options fancy-scroll">
                <h2 className="search-title">Search</h2>
                <input type="text" placeholder="Search" onChange={(e) => setSearchWord(e.target.value)} />
                <div className="event-type-radio">
                    <FormControl component="fieldset">
                        <RadioGroup defaultValue="Both" row aria-label="People" name="row-radio-buttons-group" onChange={(e) => setType(e.target.value)}>
                            <FormControlLabel value="Person" control={<Radio />} label="Person" />
                            <FormControlLabel value="Event" control={<Radio />} label="Event" />
                            <FormControlLabel value="Both" control={<Radio />} label="Both" />
                        </RadioGroup>
                    </FormControl>
                </div>
                <InterestsDropdown placeholder='Search by interests' setInterests={setInterests} defaultData={interests} />
                <FormControlLabel control={<Checkbox checked={onlyYourEvents} disabled={type === 'Person'} onChange={(e) => setOnlyYourEvents(e.target.checked)} />} label="Only Your Events" />
                <Datetime
                    input={true}
                    initialViewMode='years'
                    locale={getCurrentLocalization()}
                    timeFormat={false}
                    dateFormat={moment.localeData().longDateFormat('LL')}
                    onChange={onDateChangeHandler}
                    className='birthday'
                    inputProps={{ id: 'birthday', placeholder: 'Event date in UTC time', autoComplete: "off" }}
                />
                <button className="search" onClick={(e) => onButtonClick(e)}>Search</button>
            </form>
            <div className="results">
                <SearchPageResults
                    feed={feed}
                    loadMoreResults={loadMoreResults}
                    hasMoreEvents={hasMoreEvents}
                    hasMorePeople={hasMorePeople} />
            </div>
        </div>
    </PageLoading>)
}

export default SearchPage;