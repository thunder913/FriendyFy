import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import './PeopleListPopUp.css'
import { Link } from "react-router-dom";
import PopUp from "../PopUp";
const PeopleListPopUp = ({ title, count, loadPeople, show, setShow }) => {
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
        }else{
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
        <PopUp show={show} setShow={setShow} escClose={true}>
            <div className="popup-outer people-list-popup">
                <div className="popup-inner inner-popup">
                    <header className="title">
                        <p>{title}</p>
                        <p>{count}</p>
                        <button className="close-popup" onClick={() => setShow(false)}>x</button>
                    </header>
                    <section className={"people " + (people.length === 0 ? 'display-none' : '')}>
                        <InfiniteScroll
                            className="people-section"
                            dataLength={people.length}
                            next={loadMorePeople}
                            height={300}
                            // inverse={true}
                            hasMore={hasMore}
                            loader={<h4 className="loading-text">Loading...</h4>}
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
            </div>
        </PopUp>
    )
}

export default PeopleListPopUp;