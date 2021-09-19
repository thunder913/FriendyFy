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
                        { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
                    interests: ["Drinking", "Fun", "Dance"],
                    location: "Plaza Disco",
                    time: "22:10, 5th April 2021",
                    photo: "https://lh3.googleusercontent.com/proxy/wZ6sMbONdHbwbD4uKb-QsegLltJL4ZOqca0VBLtA5HwzOwN-nxx7jdeDsXJlYL90iTfCS6U0KrokmLw"
                },
                {
                    name: "Disko",
                    attending: [
                        { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Pesho", photo: "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0=" },
                        { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Petran", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Gosho", photo: "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0=" },
                        { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Bai Ivan", photo: "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0=" },
                        { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
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
                        { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
                    interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "InterestInterest"],
                    location: "Plaza DiscoPl",
                    time: "22:10, 5th April 2021"
                },
                {
                    name: "Disko",
                    attending: [
                        { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
                        { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
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
                        { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
                    interests: ["Drinking", "Fun", "Dance", "Interest", "Interest", "Interest", "Interest"],
                    location: "Plaza Disco",
                    time: "22:10, 5th April 2021"
                },
                {
                    name: "Disko",
                    attending: [
                        { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
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
            image: "https://tinyurl.com/44t28uud",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
                    },
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
                    },
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
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
            image: "https://tinyurl.com/44t28uud",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
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
            image: "https://tinyurl.com/44t28uud",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
                    },
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
                    }
                ],
                commonInterests: [
                ]
        },
        {
            name: "Gosho Goshov",
            image: "https://tinyurl.com/44t28uud",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
                    },
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
                    },
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
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
            image: "https://tinyurl.com/44t28uud",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
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
            image: "https://tinyurl.com/44t28uud",
            mutualFriends:
                [
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
                    },
                    {
                        name: "Ivan",
                        image: "https://tinyurl.com/44t28uud",
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