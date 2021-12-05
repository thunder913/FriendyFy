import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useScrollBlock from "../../../hooks/useScrollBlock";
import '../PopUp.css';
import './PeopleListPopUp.css'
import { Link } from "react-router-dom";
const PeopleListPopUp = ({title, count, loadPeople, closePopUp}) => {
    const [hasMore, setHasMore] = useState(true); 
    const [people, setPeople] = useState([]); 
    const [blockScroll, allowScroll] = useScrollBlock();
    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePopUpEvent();
        }
    }

    const closePopUpEvent = () => {
        allowScroll();
        closePopUp();
    }
    
    useEffect(() => {
        blockScroll();
        loadPeople(0)
            .then(async res => {
                let obj = await (res.json());
                if(obj.length>0){
                    setPeople(obj);
                }
                else{
                    setHasMore(false);
                }
            })
    }, [])

    useEffect(() => {
        window.addEventListener("keydown", escPressed, false);
        return () => {
            window.removeEventListener("keydown", escPressed, false);
          };
    }, [])

    const loadMorePeople = () => {
        return loadPeople(people.length)
        .then(async res => { 
            let obj = await res.json();
            if(obj.length>0){
                setPeople(prevState => ([...prevState, ...obj]));
            }
            else{
                setHasMore(false);
            }
        })
    }

    return(
        <div className="popup-outer people-list-popup">
            <div className="popup-inner inner-popup">
            <header className="title">
                    <p>{title}</p>
                    <p>{count}</p>
                    <button className="close-popup" onClick={closePopUpEvent}>x</button>
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
    )
}

export default PeopleListPopUp;