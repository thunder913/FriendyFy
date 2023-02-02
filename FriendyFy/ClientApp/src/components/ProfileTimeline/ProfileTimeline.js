import React, { useState, useEffect } from "react";
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import FeedPost from '../FeedPost/FeedPost';
import FeedEvent from '../FeedEvent/FeedEvent';
import MakePost from '../MakePost/MakePost'
import { useLoggedIn } from "../../contexts/LoggedInContext";
import FeedPostRepost from "../FeedPost/FeedPostRepost";
import { getFeed } from "../../services/postService";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from 'react-loader-spinner';

const ProfileTimeline = () => {
  const { loggedIn } = useLoggedIn();
  const [refreshToken, setRefreshToken] = useState(false);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [feed, setFeed] = useState([]);
  const [hasPosts, setHasPosts] = useState(true);
  const [hasEvents, setHasEvents] = useState(true);
  const userId = decodeURI(window.location.href.substring(window.location.href.lastIndexOf('/') + 1));
  const [didFirstTimeRequest, setDidFirstTimeRequest] = useState(false);
  const [feedType, setFeedType] = useState('posts');
  const [isFirstTime, setIsFirstTime] = useState(true);
  const loadMorePosts = () => {
    if (!isFirstTime) {
      if (didFirstTimeRequest) {
        return getFeed(events, posts, true, 10, userId, hasPosts, hasEvents, feedType)
          .then(async res => {
            let obj = await res.json();
            obj.posts.forEach(el => {
              if (el.postType === "Event") {
                setEvents(prev => [...prev, el.eventPostId]);
              } else if (el.postType === "Post") {
                setPosts(prev => [...prev, el.postId]);
              }
            });
            setHasEvents(obj.hasEvents);
            setHasPosts(obj.hasPosts);
            setFeed(prev => ([...prev, ...obj.posts]));
          })
      }
    }
  }

  useEffect(() => {
    setEvents([]);
    setFeed([]);
    setPosts([]);
    setHasPosts(true);
    setHasEvents(true);
    getFeed([], [], true, 10, userId, true, true, feedType)
      .then(async res => {
        let obj = await res.json();
        obj.posts.forEach(el => {
          if (el.postType === "Event") {
            setEvents(prev => [...prev, el.eventPostId]);
          } else if (el.postType === "Post") {
            setPosts(prev => [...prev, el.postId]);
          }
        });
        setFeed(obj.posts);
        setHasEvents(obj.hasEvents);
        setHasPosts(obj.hasPosts);
        setDidFirstTimeRequest(true);
        setIsFirstTime(false);
      });
    //eslint-disable-next-line
  }, [userId, feedType, refreshToken])


  return (
    <main className="profile-main">
      <ProfileSidebar />
      <div className="profile-feed">
        <div className="feed">
          {(loggedIn && loggedIn.userName === userId) ? <MakePost
            showPostImage={false}
            showCreatePost={true}
            showCreateEvent={false}
            setRefreshToken={setRefreshToken}
          /> : ''}
          <div className="feed-choice">
            <button className={("posts " + (feedType === 'posts' ? 'selected' : ''))} onClick={() => setFeedType('posts')}>POSTS</button>
            <button className={("events " + (feedType === 'events' ? 'selected' : ''))} onClick={() => setFeedType('events')}>EVENTS</button>
          </div>
          <InfiniteScroll
            className={"feed-posts"}
            dataLength={feed.length}
            next={loadMorePosts}
            hasMore={(hasEvents || hasPosts)}
            loader={<Loader
              type="TailSpin"
              color="#50A6FA"
              height={100}
              width={100}
              className="loader"
            />}
            scrollableTarget="scrollableDiv"
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>You reached the final {feedType === 'posts' ? 'post' : 'event'}</b>
              </p>
            }>
            {feed.map(el => (el.postType === 'Event' ? <FeedEvent key={el.postId+el.createdAgo} eventData={el} /> :
              !el.isRepost ? <FeedPost key={el.postId} post={el} /> : <FeedPostRepost key={el.postId} post={el} />))}
          </InfiniteScroll>
        </div>
      </div>
    </main>)
}

export default ProfileTimeline;