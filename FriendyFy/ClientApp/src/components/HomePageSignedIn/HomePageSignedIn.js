import React, { useEffect, useState } from "react";
import FeedEvent from '../FeedEvent/FeedEvent';
import { useLoggedIn } from "../../contexts/LoggedInContext";
import './HomePageSignedIn.css'
import FirstTimePopUp from '../PopUps/FirstTimePopUp/FirstTimePopUp.js'
import MakePost from "../MakePost/MakePost.js"
import { getFeed } from "../../services/postService";
import FeedPost from '../FeedPost/FeedPost';
import FeedPostRepost from '../FeedPost/FeedPostRepost';
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "react-loader-spinner";

const HomePageSignedIn = () => {
  const { loggedIn, resetUser } = useLoggedIn();
  const [showFirstTimePopUp, setShowFirstTimePopUp] = useState(false);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [feed, setFeed] = useState([]);
  const [hasPosts, setHasPosts] = useState(true);
  const [hasEvents, setHasEvents] = useState(true);
  const [didFirstTimeRequest, setDidFirstTimeRequest] = useState(false);
  const loadMorePosts = () => {
    if(didFirstTimeRequest){
    return getFeed(events, posts, false, 10, null, hasPosts, hasEvents)
      .then(async res => {
        let obj = await res.json();
        obj.posts.forEach(el => {
          if (el.postType == "Event") {
            setEvents(prev => [...prev, el.postId]);
          } else if (el.postType == "Post") {
            setPosts(prev => [...prev, el.postId]);
          }
        });
        setHasEvents(obj.hasEvents);
        setHasPosts(obj.hasPosts);
        setFeed(prev => ([...prev, ...obj.posts]));
      })
    }
  }

  useEffect(() => {
    resetUser();
    setShowFirstTimePopUp(!loggedIn.finishedFirstTimeLogin);
    getFeed(events, posts, false, 10, loggedIn ? loggedIn.userName : null, hasPosts, hasEvents)
      .then(async res => {
        let obj = await res.json();
        obj.posts.forEach(el => {
          if (el.postType == "Event") {
            setEvents(prev => [...prev, el.postId]);
          } else if (el.postType == "Post") {
            setPosts(prev => [...prev, el.postId]);
          }
        });
        setFeed(obj.posts);
        setHasEvents(obj.hasEvents);
        setHasPosts(obj.hasPosts);
        setDidFirstTimeRequest(true);
      });
    //eslint-disable-next-line
  }, [])

  return (
      <div className="feed home-feed">
        <FirstTimePopUp show={showFirstTimePopUp} setShow={setShowFirstTimePopUp} />
        {!showFirstTimePopUp ? <div className="main-feed">  <MakePost
          showPostImage={true}
          showCreatePost={true}
          showCreateEvent={true} />
          <InfiniteScroll
            className={"feed-posts"}
            dataLength={posts.length}
            next={loadMorePosts}
            hasMore={(hasPosts || hasEvents)}
            loader={<Loader
              type="MutatingDots"
              color="#50A6FA"
              secondaryColor="#3779CF"
              height={100}
              width={100}
              className="loader"
            />}
            scrollableTarget="scrollableDiv"
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>You reached the final post</b>
              </p>
            }>
            {feed.map(el => (el.postType == 'Event' ? <FeedEvent key={el.eventPostId} eventData={el} /> :
              !el.isRepost ? <FeedPost key={el.postId} post={el} /> : <FeedPostRepost key={el.postId} post={el} />))}
          </InfiniteScroll> </div>
          : ''}
      </div>)
}

export default HomePageSignedIn;