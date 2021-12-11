import React from 'react';
import FriendSuggestion from '../FriendSuggestion/FriendSuggestion';
import LeftNavigationEvents from '../LeftNavigationEvents/LeftNavigationEvents';
import SiteInfoButtons from '../SiteInfoButtons/SiteInfoButtons';
import './LeftNavigationButtons.css';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react/cjs/react.development';
import { getRecommendedFriends } from '../../services/friendService';
import { getNavigationEvents } from '../../services/eventService';
import PageLoading from '../PageLoading/PageLoading';

const LeftNavigationButtons = () => {
    const [friends, setFriends] = useState([]);
    const [events, setEvents] = useState({});
    const [blockNavScroll, setBlockNavScroll] = useState(false);
    useEffect(() => {
        getRecommendedFriends()
            .then(async res => setFriends(await res.json()));
    }, [])

    useEffect(() => {
        getNavigationEvents()
            .then(async res => setEvents(await res.json()))
    }, [])

    let location = useLocation();
    console.log(location);
    if (location.pathname !== '/' && location.pathname !== '/search-page') {
        return null;
    }
    return (
        <PageLoading>
            <div className={"left-navigation " + (blockNavScroll ? 'scroll-blocked' : '')}>
                <LeftNavigationEvents events={events} setBlockNavScroll={setBlockNavScroll} />
                <div className="people-you-may-know">
                    <div className="friend-suggestions">
                        {friends.map(friend => <FriendSuggestion key={friend.username} friend={friend} />)}
                    </div>
                </div>
                <div className="tos">
                    <SiteInfoButtons />
                </div>
            </div>
        </PageLoading>)
}

export default LeftNavigationButtons;