import React from 'react';
import './PersonYouProbablyMet.css';

const PersonYouProbablyMet = ({person}) =>(
        <div className="person-you-met">
            <div className="left-side">
            <span className="person-name">{person.name}</span>
                <div className="main-suggestion-body">
                    <div className="common-stuff">
                        <span className="friend-friends">You were together at {person.events.length} event{person.events.length > 1 ? "s" : ""}.</span>
                    </div>
                    <div className="friend-buttons">
                        <button className="add-friend">Add</button>
                        <button className="remove-suggestion">Remove</button>
                    </div>
                </div>
            </div>
            <div className="right-side">

                <div className="person-image">
                    <img src={person.image} alt="" />
                </div>
            </div>
        </div>
    )

export default PersonYouProbablyMet;