import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import './InvitePeoplePopUp.css'
import { Link } from "react-router-dom";
import PopUp from "../PopUp";
import Loader from 'react-loader-spinner';
import OutsideClickHandler from "react-outside-click-handler";
import { getEventInvitePeople } from "../../../services/eventService";
import PopUpHeader from "../PopUpHeader/PopUpHeader";
import { useNotificationConnection } from "../../../contexts/NotificationContext";
import { NotificationManager } from 'react-notifications';

const InvitePeoplePopUp = ({ title, eventId, show, setShow }) => {
    const [hasMore, setHasMore] = useState(true);
    const [people, setPeople] = useState([]);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const { connection } = useNotificationConnection();
    useEffect(() => {
        if (show) {
            getEventInvitePeople(eventId, 0, 10)
                .then(async res => {
                    let obj = await (res.json());
                    if (obj.length > 0) {
                        setPeople(obj);
                    }
                    else {
                        setHasMore(false);
                    }
                    setIsFirstTime(false);
                })
        } else {
            setPeople([]);
        }
        //eslint-disable-next-line
    }, [show])

    const loadMorePeople = () => {
        if (!isFirstTime) {
            return getEventInvitePeople(eventId, people.length, 10)
                .then(async res => {
                    let obj = await res.json();
                    if (obj.length > 0) {
                        setPeople(prevState => ([...prevState, ...obj]));
                    }
                    else {
                        setHasMore(false);
                    }
                })
        }
    }

    const invitePerson = (person) => {
        const index = people.findIndex(p => p.username === person.username);
        let newPeople = [...people];
        newPeople[index].isInvited = true;
        setPeople(newPeople);
        sendMessageEvent(person.username)
    }

    const sendMessageEvent = (username) => {
        connection.send("SendEventInviteNotification", { username, eventId });
        NotificationManager.success('Successfully sent the invite!', '', 2000);
    };

    return (
        <PopUp show={show} setShow={setShow} escClose={true} text='likes'>
            <div className="popup-outer people-list-popup invite-people">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setShow(false);
                    }}>
                    <div className="popup-inner inner-popup">
                        <PopUpHeader title={title} closePopUp={(e) => { console.log(e.target); setShow(false); }} />
                        <section className={"people "}>
                            <InfiniteScroll
                                className="people-section"
                                dataLength={people.length}
                                next={loadMorePeople}
                                height={300}
                                hasMore={hasMore}
                                loader={<Loader
                                    type="TailSpin"
                                    color="#50A6FA"
                                    height={100}
                                    width={100}
                                    className="loader"
                                />}
                                scrollableTarget="scrollableDiv"
                            >
                                {people.map(p => <div className="person">
                                    <Link key={p.username} to={'/profile/' + p.username}><article className="person">
                                        <div className="person-image">
                                            <img src={p.profileImage} alt="" />
                                        </div>
                                        <div className="name">
                                            {p.name}
                                        </div>
                                    </article>
                                    </Link>
                                    <button className={"invite-button " + (p.isInvited ? 'disabled' : '')} onClick={() => !p.isInvited ? invitePerson(p) : ''}>Invite</button>
                                </div>
                                )}
                            </InfiniteScroll>
                        </section>
                    </div>
                </OutsideClickHandler>
            </div>
        </PopUp>
    )
}

export default InvitePeoplePopUp;