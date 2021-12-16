import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import './Notifications.css';
import OutsideClickHandler from 'react-outside-click-handler';
import { CSSTransition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { useNotificationConnection } from '../../contexts/NotificationContext';
import { useLoggedIn } from '../../contexts/LoggedInContext';
import { getuserNotifications } from '../../services/notificationService';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from 'react-loader-spinner';

const Notifications = () => {
    const [show, setShow] = useState(false);
    const { connection } = useNotificationConnection();
    const { loggedIn } = useLoggedIn()
    const [notifications, setNotifications] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFirstTime, setIsFirstTime] = useState(true);
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

    useEffect(() => {
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
    }, [show])

    useEffect(() => {
        if (connection) {
            connection.on(loggedIn.id, (notification) => {
                console.log(notification);
            })
        }
    }, [])

    return (<div className="notifications circle-right">
        <OutsideClickHandler
            onOutsideClick={() => {
                setShow(false);
            }}>
            <div className="notification-button" onClick={() => setShow(prev => !prev)}>
                <FontAwesomeIcon icon={faBell} />
            </div>
            <div className="new-notification">10</div>
            <CSSTransition
                in={show}
                timeout={200}
                classNames="animation-options"
                unmountOnExit
                onEnter={() => setShow(true)}
                onExited={() => setShow(false)}>
                <div className="notifications-pop-up">
                    <InfiniteScroll
                        className="notifications-section"
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
                        {notifications.map(not => <div className="user-notification">
                            <div className="notification-image">
                                <img src={not.image} alt="" />
                            </div>
                            <p>{not.name} invited you to join {not.eventName}</p>
                            <div className="notification-options">
                                <button className='accept'>Accept</button>
                                <button className='reject'>Reject</button>
                            </div>
                        </div>)}
                    </InfiniteScroll>


                </div>
            </CSSTransition>
        </OutsideClickHandler>
    </div >)
}

export default Notifications;