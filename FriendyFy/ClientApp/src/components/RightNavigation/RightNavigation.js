import React from 'react';
import PersonYouProbablyMet from '../PersonYouProbablyMet/PersonYouProbablyMet';
import './RightNavigation.css';
import { useLocation } from 'react-router';
const people = [
    {
        name: "Ivan Petrov",
        image: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854",
        events: [{
            name: "Disko Partay"
        },
        {name: "Netflix n Chill"}],
    },
    {
        name: "Ivan Petrov",
        image: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854",
        events: [{
            name: "Disko Partay"
        },
        {name: "Netflix n Chill"}],
    },
    {
        name: "Ivan Petrov",
        image: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854",
        events: [{
            name: "Disko Partay"
        },
        {name: "Netflix n Chill"}],
    },
]

const RightNavigation = () =>{
    let location = useLocation();
    if (location.pathname.match("/profile") || location.pathname.match("/event") || location.pathname.match("/friends") || location.pathname.match("/photos")) {
        return null;
    }

    return(
    <aside className="right-navigation">
        <div className="top-half">
            <ul className="right-navigation-list">
                <li className="right-user">
                    <div className="right-user-photo">
                        <img src="https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" alt="" />
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
                    <p className="right-nav-button">Search Page</p>
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