import React, { useEffect, useState } from "react";
import FeedPost from '../FeedPost/FeedPost';
import FeedEvent from '../FeedEvent/FeedEvent';
import { useLoggedIn } from "../../contexts/LoggedInContext";
import './HomePageSignedIn.css'
import FirstTimePopUp from '../PopUps/FirstTimePopUp/FirstTimePopUp.js'
import useScrollBlock from "../../hooks/useScrollBlock";
import MakePost from "../MakePost/MakePost.js"
import { getPosts } from "../../services/postService";
import { getEvents } from "../../services/eventService";
const events = [
  {
    name: "Event_Name1",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun', 'Rakiya', 'Drinking', 'Dance', 'Fun', 'Rakiya', 'Drinking', 'Dance', 'Fun', 'Rakiya', 'Drinking', 'Dance', 'Fun',],
    attending: [
      { name: "Gosho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Pesho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Bai Ivan", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Petran", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Gosho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Pesho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Bai Ivan", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Petran", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Gosho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Pesho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Bai Ivan", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Petran", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" }],
  },
  {
    name: "Event_Name2",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
    attending: [
      { name: "Gosho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Pesho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Bai Ivan", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Petran", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" }],
  },
  {
    name: "Event_Name3",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
    attending: [
      { name: "Gosho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Pesho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Bai Ivan", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Petran", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" }],
  },
  {
    name: "Event_Name4",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
    attending: [
      { name: "Gosho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Pesho", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Bai Ivan", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" },
      { name: "Petran", photo: "https://scontent.fsof8-1.fna.fbcdn.net/v/t1.6435-9/194957949_4334439429940720_5542816028295677772_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=YeTxne8hWKoAX9bbJvR&_nc_ht=scontent.fsof8-1.fna&oh=51a6dbebf71ee668c34d7292be94abf0&oe=6192F854" }],
  }
]
const HomePageSignedIn = () => {
  const [blockScroll, allowScroll] = useScrollBlock();

  const { loggedIn, resetUser } = useLoggedIn();
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const checkFirstTimePopUp = async () => {
    await resetUser();
    if(loggedIn.finishedFirstTimeLogin){
      allowScroll();
    }else{
      blockScroll();
    }
  }
  
  //Make it async if anything goes wrong
  useEffect(() => {
    checkFirstTimePopUp();
    if(loggedIn){
      getPosts().then(async res => setPosts(await res.json()))
      getEvents().then(async res => setEvents(await res.json()));
    }
    //eslint-disable-next-line
  },[])

  return (<div className="feed home-feed">
    {loggedIn.finishedFirstTimeLogin ? '' : <FirstTimePopUp checkFirstTimePopUp={checkFirstTimePopUp}></FirstTimePopUp>}
    <MakePost
      showPostImage={true}
      showCreatePost={true}
      showCreateEvent={true}/>
    {/* {posts.map(post => <FeedPost key={post.postId} post={post} />)} */}
    {events.map(event => <FeedEvent event={event} />)}
  </div>)
}

export default HomePageSignedIn;