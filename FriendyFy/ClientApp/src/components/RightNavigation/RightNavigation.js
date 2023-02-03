import React, { useEffect, useState } from 'react';
import PersonYouProbablyMet from '../PersonYouProbablyMet/PersonYouProbablyMet';
import './RightNavigation.css';
import { useLocation } from 'react-router';
import { getRightNavigationSuggestions } from '../../services/friendService';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { Link } from 'react-router-dom';
import PageLoading from '../PageLoading/PageLoading';
import { getRandomEvent } from '../../services/eventService';

const RightNavigation = () => {
    const { loggedIn } = useLoggedIn();
    let location = useLocation();
    const [randomEventId, setRandomEventId] = useState('');
    const [recommendations, setRecommendation] = useState([]);

    const getNewEvent = () => {
        getRandomEvent().then(async res => setRandomEventId(await res.text()))
    }

    useEffect(() => {
        getRightNavigationSuggestions()
            .then(async res => {
                let obj = await res.json();
                setRecommendation(obj);
            })
        getRandomEvent().then(async res => setRandomEventId(await res.text()))
    }, [])

    if (location.pathname !== '/' && location.pathname !== '/search-page' && location.pathname !== '/Auth/Register') {
        return null;
    }

    return (<aside className="right-navigation">
        <PageLoading>
            <div className="top-half">
                <ul className="right-navigation-list">
                    <li className="right-user right-user-name right-nav-button">
                        <Link to={"/profile/" + loggedIn.userName}>
                            <div className="right-user-photo">
                                <img src={loggedIn.profilePhoto} alt="" />
                            </div>
                            {loggedIn.firstName} {loggedIn.lastName}
                        </Link>
                    </li>
                    <li className="right-nav-button">
                        <Link to={"/profile/" + loggedIn.userName} >
                            Profile
                        </Link>
                    </li>
                    <li className="right-nav-button">
                        <Link to={"/friends/" + loggedIn.userName} >
                            Friends
                        </Link>
                    </li>
                    <li className="right-nav-button">
                        <Link to="/search-page" >
                            Search Page
                        </Link>
                    </li>
                    <li className="right-nav-button">
                        <Link to={"/event/" + randomEventId} onClick={() => getNewEvent()}>
                            Random Event
                        </Link>
                    </li>
                    <li className="right-nav-button">
                        <Link to={"/search-page?onlyUserEvents=true"} >
                            My Events
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="bottom-half">
                <h2 className="people-you-met-title">People You Probably Met</h2>
                {recommendations.map(person => <PersonYouProbablyMet key={person.username} person={person} />)}
            </div>
        </PageLoading>
    </aside>
    )
}

export default RightNavigation;