import React from 'react';
import LeftNavigationEvents from '../LeftNavigationEvents/LeftNavigationEvents';
import './LeftNavigationButtons.css';

const events = [
    {title: "Events attending",
    events: 
    [
        {
            name: "Disko",
            attending: [
            {name: "Gosho", photo: "https://tinyurl.com/44t28uud"},
            {name: "Pesho", photo: "https://tinyurl.com/44t28uud"},
            {name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud"},
            {name: "Petran", photo: "https://tinyurl.com/44t28uud"}],
            interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
            location: "Plaza Disco",
            time: "22:10, 5th April 2021"
        },
        {
            name: "Disko",
            attending: [
            {name: "Gosho", photo: "https://tinyurl.com/44t28uud"},
            {name: "Pesho", photo: "https://tinyurl.com/44t28uud"},
            {name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud"},
            {name: "Petran", photo: "https://tinyurl.com/44t28uud"},
            {name: "Gosho", photo: "https://tinyurl.com/44t28uud"},
            {name: "Pesho", photo: "https://tinyurl.com/44t28uud"},
            {name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud"},
            {name: "Petran", photo: "https://tinyurl.com/44t28uud"}],
            interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
            location: "Plaza Disco",
            time: "22:10, 5th April 2021"
        },
    ]},
    {title: "Recommended events",
    events: 
    [
        {
            name: "Disko",
            attending: [
            {name: "Gosho", photo: "https://tinyurl.com/44t28uud"},
            {name: "Petran", photo: "https://tinyurl.com/44t28uud"}],
            interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
            location: "Plaza Disco",
            time: "22:10, 5th April 2021"
        },
        {
            name: "Disko",
            attending: [
            {name: "Gosho", photo: "https://tinyurl.com/44t28uud"},
            {name: "Pesho", photo: "https://tinyurl.com/44t28uud"},
            {name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud"},
            {name: "Petran", photo: "https://tinyurl.com/44t28uud"}],
            interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
            location: "Plaza Disco",
            time: "22:10, 5th April 2021"
        }
    ]},
    {title: "Organized by you",
    events: 
    [
        {
            name: "Disko",
            attending: [
            {name: "Petran", photo: "https://tinyurl.com/44t28uud"}],
            interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
            location: "Plaza Disco",
            time: "22:10, 5th April 2021"
        },
        {
            name: "Disko",
            attending: [
            {name: "Petran", photo: "https://tinyurl.com/44t28uud"}],
            interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
            location: "Plaza Disco",
            time: "22:10, 5th April 2021"
        }
    ]}
];


const LeftNavigationButtons = () =>(
        <div className="left-navigation">
                <LeftNavigationEvents events={events}/>
            <div className="class">
    
            </div>
            <div className="people-you-may-know">
    
            </div>
            <div className="tos">
                
            </div>
        </div>
    )

export default LeftNavigationButtons;