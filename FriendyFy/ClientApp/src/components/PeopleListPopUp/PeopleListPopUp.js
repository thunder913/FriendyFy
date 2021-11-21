import React, { useEffect, useState } from "react";
import './PeopleListPopUp.css'
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from 'react-router';
import useScrollBlock from "../../hooks/useScrollBlock";
const PeopleListPopUp = ({title, count, loadPeople, closePopUp}) => {
    const [blockScroll, allowScroll] = useScrollBlock();
    const [hasMore, setHasMore] = useState(true); 
    const [people, setPeople] = useState([]); 
    const history = useHistory();
    const escPressed = (e) => {
        if(e.keyCode === 27){
            closePopUp();
        }
    }

    const redirectToUserProfile = (username) => {
        history.push('/profile/' + username);
    }
    
    useEffect(() => {
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
                    <button className="close-popup" onClick={closePopUp}>x</button>
                </header>
                <section className="people">
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
                        {people.map(p => <article className="person">
                        <div className="person-image" onClick={() => redirectToUserProfile(p.username)}>
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