import React, { useEffect } from "react";
import FeedPost from '../FeedPost/FeedPost';
import FeedEvent from '../FeedEvent/FeedEvent';
import { useLoggedIn } from "../../contexts/LoggedInContext";
import './HomePageSignedIn.css'
import FirstTimePopUp from '../FirstTimePopUp/FirstTimePopUp.js'
import { useState } from "react/cjs/react.development";
import useScrollBlock from "../../hooks/useScrollBlock";
const events = [
  {
    name: "Event_Name1",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun', 'Rakiya', 'Drinking', 'Dance', 'Fun', 'Rakiya', 'Drinking', 'Dance', 'Fun', 'Rakiya', 'Drinking', 'Dance', 'Fun',],
    attending: [
      { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
      { name: "Petran", photo: "https://tinyurl.com/44t28uud" },
      { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
      { name: "Petran", photo: "https://tinyurl.com/44t28uud" },
      { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
      { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
  },
  {
    name: "Event_Name2",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
    attending: [
      { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
      { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
  },
  {
    name: "Event_Name3",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
    attending: [
      { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
      { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
  },
  {
    name: "Event_Name4",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
    attending: [
      { name: "Gosho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Pesho", photo: "https://tinyurl.com/44t28uud" },
      { name: "Bai Ivan", photo: "https://tinyurl.com/44t28uud" },
      { name: "Petran", photo: "https://tinyurl.com/44t28uud" }],
  }
]
const HomePageSignedIn = () => {
  const [blockScroll, allowScroll] = useScrollBlock();
  const [userFirstTime, setUserFirstTime] = useState(false);

  const { loggedIn } = useLoggedIn();
  useEffect(() => {
    setUserFirstTime(loggedIn.finishedFirstTimeLogin);
    if(!userFirstTime){
      console.log("Not logged in")
      blockScroll();
    }else{
      allowScroll();
    }
  }, [userFirstTime])

  return (<div className="feed home-feed">
    {!userFirstTime ? <FirstTimePopUp></FirstTimePopUp> : ''}
    {events.map(event => <FeedEvent event={event} />)}
    <FeedPost image="https://tinyurl.com/44t28uud"></FeedPost>
    <FeedPost text="This is a very special post................. ......... This is a very special post................. ......... This is a very special post................. ......... This is a very special post................. ......... This is a very special post................. ......... This is a very special post................. ........."></FeedPost>
    <FeedPost image="http://www.orneveien.org/nikon-d800/panoramas/huge/2015-02-06-wellville-mountains-gleaming-new-snow-panorama-halfsize.jpg"></FeedPost>
    <FeedPost image="https://jillsbooks.files.wordpress.com/2011/02/abraham-lincoln-was-very-tall.jpg" text="This is my first post!"></FeedPost>
  </div>)
}

export default HomePageSignedIn;