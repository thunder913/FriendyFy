import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import './PeopleListPopUp.css'
import { Link } from "react-router-dom";
import PopUp from "../PopUp";
import Loader from 'react-loader-spinner';
import OutsideClickHandler from "react-outside-click-handler";

const PeopleListPopUp = ({ title, count, loadPeople, show, setShow, manyPopUps }) => {
    const [hasMore, setHasMore] = useState(true);
    const [people, setPeople] = useState([]);

    useEffect(() => {
        if (show) {
            loadPeople(0)
                .then(async res => {
                    let obj = await (res.json());
                    if (obj.length > 0) {
                        setPeople(obj);
                    }
                    else {
                        setHasMore(false);
                    }
                })
        } else {
            setPeople([]);
        }
    }, [show])

    const loadMorePeople = () => {
        return loadPeople(people.length)
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

    return (
        <PopUp show={show} setShow={setShow} escClose={true} text='likes' manyPopUps={manyPopUps}>
            <div className="popup-outer people-list-popup">
                <OutsideClickHandler
                    onOutsideClick={() => {
                        setShow(false);
                    }}>
                    <div className="popup-inner inner-popup">
                        <header className="title">
                            <p>{title}</p>
                            <p>{count}</p>
                            <button className="close-popup" onClick={() => setShow(false)}>x</button>
                        </header>
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
                                {people.map(p => <Link to={'/profile/' + p.username}><article className="person">
                                    <div className="person-image">
                                        <img src={p.profileImage} alt="" />
                                    </div>
                                    <div className="name">
                                        {p.name}
                                    </div>
                                </article>
                                </Link>)}
                            </InfiniteScroll>
                        </section>
                    </div>
                </OutsideClickHandler>
            </div>
        </PopUp>
    )
}

export default PeopleListPopUp;