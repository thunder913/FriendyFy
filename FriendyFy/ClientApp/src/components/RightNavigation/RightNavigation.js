import React from 'react';
import PersonYouProbablyMet from '../PersonYouProbablyMet/PersonYouProbablyMet';
import './RightNavigation.css';
import { useLocation } from 'react-router';
const people = [
    {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
        events: [{
            name: "Disko Partay"
        },
        {name: "Netflix n Chill"}],
    },
    {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
        events: [{
            name: "Disko Partay"
        },
        {name: "Netflix n Chill"}],
    },
    {
        name: "Ivan Petrov",
        image: "/static/media/testPhoto.c8119cb6.jpg",
        events: [{
            name: "Disko Partay"
        },
        {name: "Netflix n Chill"}],
    },
]

const RightNavigation = () =>{
    let location = useLocation();
    if (location.pathname.match("/profile")) {
        return null;
    }

    return(
    <aside className="right-navigation">
        <div className="top-half">
            <ul className="right-navigation-list">
                <li className="right-user">
                    <div className="right-user-photo">
                        <img src="/static/media/testPhoto.c8119cb6.jpg" alt="" />
                    </div>
                    <p className="right-user-name">Andon Gorchov</p>
                </li>
                <li>
                    <p className="right-nav-button">
                        Profile
                    </p>
                </li>
                <li>
                    <p className="right-nav-button">Friends</p>
                </li>
                <li>
                    <p className="right-nav-button">Events</p>
                </li>
                <li>
                    <p className="right-nav-button">Chatter</p>
                </li>
                <li>
                    <p className="right-nav-button">Random Match</p>
                </li>
                <li>
                    <p className="right-nav-button">Contact Us</p>
                </li>
            </ul>
        </div>
        <div className="bottom-half">
            <h2 className="people-you-met-title">People You Probably Met</h2>
            {people.map(person => <PersonYouProbablyMet person={person} />)}
            <h3 className="see-more-text">See more...</h3>
        </div>
    </aside>)
}

export default RightNavigation;