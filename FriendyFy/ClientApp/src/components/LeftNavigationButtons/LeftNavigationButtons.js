import React, { useEffect, useState } from 'react';
import FriendSuggestion from '../FriendSuggestion/FriendSuggestion';
import LeftNavigationEvents from '../LeftNavigationEvents/LeftNavigationEvents';
import SiteInfoButtons from '../SiteInfoButtons/SiteInfoButtons';
import './LeftNavigationButtons.css';
import { useLocation } from 'react-router';
import { getRecommendedFriends } from '../../services/friendService';
import { getNavigationEvents } from '../../services/eventService';
import PageLoading from '../PageLoading/PageLoading';

const LeftNavigationButtons = () => {
    const [friends, setFriends] = useState([]);
    const [events, setEvents] = useState({});
    const [blockNavScroll, setBlockNavScroll] = useState(false);
    const [friendsRemaining, setFriendsRemaining] = useState(0);
    let location = useLocation();
    useEffect(() => {
        getRecommendedFriends()
            .then(async res => {
                let obj = await res.json();
                setFriends(obj);
                setFriendsRemaining(obj.length);
            })
    }, [])

    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/search-page') {
            getNavigationEvents()
                .then(async res => setEvents(await res.json()))
        }
    }, [location.pathname])

    if (location.pathname !== '/' && location.pathname !== '/search-page') {
        return null;
    }
    return (
        <PageLoading>
            <div className={"left-navigation fancy-scroll " + (blockNavScroll ? 'scroll-blocked' : '')}>
                <LeftNavigationEvents events={events} setBlockNavScroll={setBlockNavScroll} />
                <div className="people-you-may-know">
                    {friendsRemaining ? <div className="friend-suggestions">
                        {friends.map(friend => <FriendSuggestion key={friend.username} friend={friend} setFriendsRemaining={setFriendsRemaining} setFriends={setFriends}/>)}
                    </div> : ''}
                </div>
                <div className="tos">
                    <SiteInfoButtons />
                </div>
            </div>
        </PageLoading>)
}

export default LeftNavigationButtons;