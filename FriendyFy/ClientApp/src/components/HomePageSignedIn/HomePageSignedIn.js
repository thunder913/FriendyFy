import React, { useEffect, useState } from "react";
import FeedPost from '../FeedPost/FeedPost';
import FeedEvent from '../FeedEvent/FeedEvent';
import { useLoggedIn } from "../../contexts/LoggedInContext";
import './HomePageSignedIn.css'
import FirstTimePopUp from '../PopUps/FirstTimePopUp/FirstTimePopUp.js'
import MakePost from "../MakePost/MakePost.js"
import { getPosts } from "../../services/postService";
import { getEvents } from "../../services/eventService";
import FeedPostRepost from "../FeedPost/FeedPostRepost";

const HomePageSignedIn = () => {
  const { loggedIn, resetUser } = useLoggedIn();
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showFirstTimePopUp, setShowFirstTimePopUp] = useState(false);

  useEffect(() => {
    resetUser();
    setShowFirstTimePopUp(!loggedIn.finishedFirstTimeLogin);
    if(loggedIn){
      getPosts().then(async res => setPosts(await res.json()))
      getEvents().then(async res => setEvents(await res.json()));
    }
    //eslint-disable-next-line
  },[])

  return (<div className="feed home-feed">
    <FirstTimePopUp show={showFirstTimePopUp} setShow={setShowFirstTimePopUp}/>
    <MakePost
      showPostImage={true}
      showCreatePost={true}
      showCreateEvent={true}/>
    {/* {posts.map(post => (!post.isRepost ? <FeedPost key={post.postId} post={post} /> : <FeedPostRepost key={post.postId} post={post}/>))} */}
    {events.map(event => <FeedEvent eventData={event} />)}
  </div>)
}

export default HomePageSignedIn;