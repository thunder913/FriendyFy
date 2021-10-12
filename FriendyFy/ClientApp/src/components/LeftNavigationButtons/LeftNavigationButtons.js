import React from 'react';
import FriendSuggestion from '../FriendSuggestion/FriendSuggestion';
import LeftNavigationEvents from '../LeftNavigationEvents/LeftNavigationEvents';
import TermsOfService from '../TermsOfService/TermsOfService';
import './LeftNavigationButtons.css';
import { useLocation } from 'react-router';

const events = [
    {
        title: "Attending",
        events:
            [
                {
                    name: "Disko",
                    attending: [
                        { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
                    interests: ["Drinking", "Fun", "Dance"],
                    location: "Plaza Disco",
                    time: "22:10, 5th April 2021",
                    photo: "https://lh3.googleusercontent.com/proxy/wZ6sMbONdHbwbD4uKb-QsegLltJL4ZOqca0VBLtA5HwzOwN-nxx7jdeDsXJlYL90iTfCS6U0KrokmLw"
                },
                {
                    name: "Disko",
                    attending: [
                        { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Pesho", photo: "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0=" },
                        { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Gosho", photo: "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0=" },
                        { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Bai Ivan", photo: "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0=" },
                        { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
                    interests: ["Drinking", "Interest", "Dance", "Interest", "Interest", "Interest", "Interest"],
                    location: "Plaza Disco",
                    time: "22:10, 5th April 2021"
                },
            ]
    },
    {
        title: "Suggested",
        events:
            [
                {
                    name: "Disko",
                    attending: [
                        { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
                    interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "InterestInterest"],
                    location: "Plaza DiscoPl",
                    time: "22:10, 5th April 2021"
                },
                {
                    name: "Disko",
                    attending: [
                        { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
                        { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
                    interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
                    location: "Plaza Disco",
                    time: "22:10, 5th April 2021"
                }
            ]
    },
    {
        title: "Organized",
        events:
            [
                {
                    name: "Disko",
                    attending: [
                        { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
                    interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
                    location: "Plaza Disco",
                    time: "22:10, 5th April 2021"
                },
                {
                    name: "Disko",
                    attending: [
                        { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
                    interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
                    location: "Plaza Disco",
                    time: "22:10, 5th April 2021"
                }
            ]
    }
];

const friends =
    [
        {
            name: "Gosho GoshovGosho",
            image: "/static/media/testPhoto.c8119cb6.jpg",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    },
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    },
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    }
                ],
            commonInterests: [
                {
                    name: "Swiming",
                },
                {
                    name: "Drinking"
                }
            ]
        },
        {
            name: "Petur Peturov",
            image: "/static/media/testPhoto.c8119cb6.jpg",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    }
                ],
                commonInterests: [
                    {
                        name: "Swiming",
                    },
                    {
                        name: "Drinking"
                    }
                ]
        },
        {
            name: "Andon Andonov",
            image: "/static/media/testPhoto.c8119cb6.jpg",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    },
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    }
                ],
                commonInterests: [
                ]
        },
        {
            name: "Gosho Goshov",
            image: "/static/media/testPhoto.c8119cb6.jpg",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    },
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    },
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    }
                ],
            commonInterests: [
                {
                    name: "Swiming",
                },
                {
                    name: "Drinking"
                }
            ]
        },
        {
            name: "Petur Peturov",
            image: "/static/media/testPhoto.c8119cb6.jpg",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    }
                ],
                commonInterests: [
                    {
                        name: "Swiming",
                    },
                    {
                        name: "Drinking"
                    }
                ]
        },
        {
            name: "Andon Andonov",
            image: "/static/media/testPhoto.c8119cb6.jpg",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    },
                    {
                        name: "Ivan",
                        image: "/static/media/testPhoto.c8119cb6.jpg",
                    }
                ],
                commonInterests: [
                ]
        }
    ]

const LeftNavigationButtons = () => {
    let location = useLocation();
    if (location.pathname.match("/profile")  || location.pathname.match("/friends") || location.pathname.match("/photos")) {
        return null;
    }
    return (<div className="left-navigation">
        <LeftNavigationEvents events={events} />
        <div className="people-you-may-know">
            <div className="friend-suggestions">
                {friends.map(friend => <FriendSuggestion friend={friend} />)}
            </div>
        </div>
        <div className="tos">
            <TermsOfService/>
        </div>
    </div>)
}

export default LeftNavigationButtons;