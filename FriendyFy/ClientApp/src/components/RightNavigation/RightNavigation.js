import React from 'react';
import PersonYouProbablyMet from '../PersonYouProbablyMet/PersonYouProbablyMet';
import './RightNavigation.css';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react/cjs/react.development';
import { getRightNavigationSuggestions } from '../../services/friendService';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { Link } from 'react-router-dom';
const RightNavigation = () => {
    const { loggedIn } = useLoggedIn();
    let location = useLocation();
    const [recommendations, setRecommendation] = useState([]);
    useEffect(() => {
        getRightNavigationSuggestions()
            .then(async res => {
                let obj = await res.json();
                setRecommendation(obj);
            })
    }, [])

    if (location.pathname.match("/profile") || location.pathname.match("/event") || location.pathname.match("/friends") || location.pathname.match("/photos")) {
        return null;
    }

    return (
        <aside className="right-navigation">
            <div className="top-half">
                <ul className="right-navigation-list">
                    <li className="right-user right-user-name right-nav-button">
                        <div className="right-user-photo">
                            <img src={loggedIn.profilePhoto} alt="" />
                        </div>
                        <Link to={"/profile/" + loggedIn.userName}>{loggedIn.firstName} {loggedIn.lastName}</Link>
                    </li>
                    <li className="right-nav-button">
                    <Link to={"/profile/" + loggedIn.userName} >
                            Profile
                        </Link>
                    </li>
                    <li className="right-nav-button">
                    <Link to={"/profile/" + loggedIn.userName} >
                            Friends
                        </Link>
                    </li>
                    <li className="right-nav-button">
                    <Link to={"/profile/" + loggedIn.userName} >
                            Search Page
                        </Link>
                    </li>
                    <li className="right-nav-button">
                    <Link to={"/profile/" + loggedIn.userName} >
                            Random Event
                        </Link>
                    </li>
                    <li className="right-nav-button">
                    <Link to={"/profile/" + loggedIn.userName} >
                            Contact Us
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="bottom-half">
                <h2 className="people-you-met-title">People You Probably Met</h2>
                {recommendations.map(person => <PersonYouProbablyMet person={person} />)}
            </div>
        </aside>)
}

export default RightNavigation;