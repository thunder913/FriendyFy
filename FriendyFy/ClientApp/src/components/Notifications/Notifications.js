import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import './Notifications.css';
import OutsideClickHandler from 'react-outside-click-handler';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { useNotificationConnection } from '../../contexts/NotificationContext';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { getuserNotifications, acceptNotificationEvent, rejectNotificationEvent, getUnseenCount, seeNotification } from '../../services/notificationService';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from 'react-loader-spinner';
import moment from 'moment';

const Notifications = () => {
    const [show, setShow] = useState(false);
    const { connection } = useNotificationConnection();
    const { loggedIn } = useLoggedIn()
    const [notifications, setNotifications] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [unseenCount, setUnseenCount] = useState(0);

    function getTime(time) {
        let timeFormat = 'HH:mm ' + moment.localeData().longDateFormat('L');
        let testDateUtc = moment.utc(time);
        let localDate = testDateUtc.local();
        return localDate.format(timeFormat);
    }

    const loadNotifications = () => {
        if (!isFirstTime) {
            return getuserNotifications(loggedIn.id, 10, notifications.length)
                .then(async res => {
                    let obj = await res.json();
                    if (obj.length > 0) {
                        setNotifications(prevState => ([...prevState, ...obj]));
                    }
                    else {
                        setHasMore(false);
                    }
                })
        }
    }

    const eventAction = (notificationId, status) => {
        const index = notifications.findIndex(n => n.id === notificationId);
        let newNotifications = [...notifications];
        newNotifications[index].isAvailable = false;
        if (status) {
            acceptNotificationEvent(notificationId)
                .then(res => {
                    if (res.status === 200) {
                        newNotifications[index].isAvailable = false;
                        setNotifications(newNotifications);
                    }
                });
        } else {
            rejectNotificationEvent(notificationId)
                .then(res => {
                    if (res.status === 200) {
                        newNotifications[index].isAvailable = false;
                        setNotifications(newNotifications);
                    }
                });
        }

    }

    useEffect(() => {
        setUnseenCount(0);
        if (show) {
            getuserNotifications(loggedIn.id, 10, 0)
                .then(async res => {
                    let obj = await (res.json());
                    if (obj.length > 0) {
                        setNotifications(obj);
                    }
                    else {
                        setHasMore(false);
                    }
                    setIsFirstTime(false);
                })
        } else {
            setNotifications([]);
        }
        //eslint-disable-next-line
    }, [show])

    useEffect(() => {
        if (connection) {
            connection.on(loggedIn.id, (notification) => {
                if (show) {
                    seeNotification(notification.id);
                    notification.isSeen = true;
                } else {
                    setUnseenCount(prev => Number(prev) + 1);
                }
                setNotifications(prev => ([notification, ...prev]));
            })
        }
        getUnseenCount()
            .then(async res => setUnseenCount(await res.text()));
        //eslint-disable-next-line
    }, [])

    return (<div className="notifications circle-right">
        <OutsideClickHandler
            onOutsideClick={() => {
                setShow(false);
            }}>
            <div className="notification-button" onClick={() => setShow(prev => !prev)}>
                <FontAwesomeIcon icon={faBell} />
            </div>
            {unseenCount > 0 ? <div className="new-notification" onClick={() => setShow(prev => !prev)}>{unseenCount}</div> : ''}
            <CSSTransition
                in={show}
                timeout={200}
                classNames="animation-options"
                unmountOnExit
                onEnter={() => setShow(true)}
                onExited={() => setShow(false)}>
                <div className="notifications-pop-up">
                    <InfiniteScroll
                        className="notifications-section fancy-scroll   "
                        dataLength={notifications.length}
                        next={loadNotifications}
                        height={500}
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
                        {notifications.map(not => (<div key={not.id} title={getTime(not.date)} className="user-notification">
                            <Link to={("/profile/" + not.inviterUsername)}>
                                <div className="notification-image">
                                    <img src={not.image} alt="" />
                                </div>
                            </Link>
                            {not.type === 'event' ? <p><Link className="inviter-name" to={"/profile/" + not.inviterUsername}>{not.name}</Link> invited you to join <Link className="event-name" to={"/event/" + not.eventId}>{not.eventName}.</Link></p> : ''}
                            {not.type === 'profile' ? <p><Link className="inviter-name" to={"/profile/" + not.inviterUsername}>{not.name}</Link> sent you a friend request.</p> : ''}
                            {(not.isAvailable && not.type === 'event') ? <div className="notification-options">
                                <button className='accept' onClick={() => eventAction(not.id, true)}>Accept</button>
                                <button className='reject' onClick={() => eventAction(not.id, false)}>Reject</button>
                            </div> : ''}
                        </div>))}
                    </InfiniteScroll>


                </div>
            </CSSTransition>
        </OutsideClickHandler>
    </div >)
}

export default Notifications;