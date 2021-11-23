import React, { useEffect, useState } from "react";
import './PeopleListPopUp.css'
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from 'react-router';
import useScrollBlock from "../../hooks/useScrollBlock";
const PeopleListPopUp = ({title, count, loadPeople, closePopUp}) => {
    const [hasMore, setHasMore] = useState(true); 
    const [people, setPeople] = useState([]); 
    const [blockScroll, allowScroll] = useScrollBlock();
    const history = useHistory();
    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePopUpEvent();
        }
    }

    const closePopUpEvent = () => {
        allowScroll();
        closePopUp();
    }

    const redirectToUserProfile = (username) => {
        history.push('/profile/' + username);
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
        document.addEventListener("keydown", escPressed, false);
        return () => {
            document.removeEventListener("keydown", escPressed, false);
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
        <div className="people-list-popup">
            <div className="inner-popup">
            <header className="title">
                    <p>{title}</p>
                    <p>{count}</p>
                    <button className="close-popup" onClick={closePopUpEvent}>x</button>
                </header>
                <section className={"people " + (people.length === 0 ? 'display-none' : '')}>
                <InfiniteScroll
                        className="comments-section"
                        dataLength={people.length}
                        next={loadMorePeople}
                        height={300}
                        // inverse={true}
                        hasMore={hasMore}
                        loader={<h4 className="loading-text">Loading...</h4>}
                        scrollableTarget="scrollableDiv"
                        >
                        {people.map(p => <article className="person" onClick={() => redirectToUserProfile(p.username)}>
                        <div className="person-image">
                            <img src={p.profileImage} alt="" />
                        </div>
                        <div className="name">
                            {p.name}
                        </div>
                    </article>)}
                    </InfiniteScroll>
                </section>
            </div>
        </div>
    )
}

export default PeopleListPopUp;