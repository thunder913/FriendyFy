import React, {useState, useEffect} from "react";
import ProfileSidebar from '../ProfileSidebar/ProfileSidebar';
import FeedPost from '../FeedPost/FeedPost';
import FeedEvent from '../FeedEvent/FeedEvent';
import { getPosts } from "../../services/postService";
import { useLoggedIn } from "../../contexts/LoggedInContext";

const ProfileTimeline = () => {
    const { loggedIn, resetUser } = useLoggedIn();
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        if(loggedIn){
          getPosts().then(async res => setPosts(await res.json()))
        }
        //eslint-disable-next-line
      },[])

      
    return(
    <main className="profile-main">
    <ProfileSidebar/>
       <div className="profile-feed">
           <div className="feed">
           {/* {events.map(event => <FeedEvent event={event} />)} */}
           {posts.map(post => <FeedPost key={post.postId} post={post} />)}
           </div>
       </div>
   </main>)
}

export default ProfileTimeline;