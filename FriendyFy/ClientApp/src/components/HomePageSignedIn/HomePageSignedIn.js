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
      { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
  },
  {
    name: "Event_Name2",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
    attending: [
      { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
  },
  {
    name: "Event_Name3",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
    attending: [
      { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
  },
  {
    name: "Event_Name4",
    location: 'Plaza Disco',
    time: '23.05.2021 at 22:00',
    interests: ['Rakiya', 'Drinking', 'Dance', 'Fun'],
    attending: [
      { name: "Gosho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Pesho", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Bai Ivan", photo: "/static/media/testPhoto.c8119cb6.jpg" },
      { name: "Petran", photo: "/static/media/testPhoto.c8119cb6.jpg" }],
  }
]
const HomePageSignedIn = () => {
  const [blockScroll, allowScroll] = useScrollBlock();

  const { loggedIn, resetUser } = useLoggedIn();
  const checkFirstTimePopUp = async () => {
    await resetUser();
    if(loggedIn.finishedFirstTimeLogin){
      allowScroll();
    }else{
      blockScroll();
    }
  }
  
  useEffect(async () => {
    await checkFirstTimePopUp();
  },[])

  return (<div className="feed home-feed">
    {loggedIn.finishedFirstTimeLogin ? '' : <FirstTimePopUp checkFirstTimePopUp={checkFirstTimePopUp}></FirstTimePopUp>}
    {events.map(event => <FeedEvent event={event} />)}
    <FeedPost image="/static/media/testPhoto.c8119cb6.jpg"></FeedPost>
    <FeedPost text="This is a very special post................. ......... This is a very special post................. ......... This is a very special post................. ......... This is a very special post................. ......... This is a very special post................. ......... This is a very special post................. ........."></FeedPost>
    <FeedPost image="http://www.orneveien.org/nikon-d800/panoramas/huge/2015-02-06-wellville-mountains-gleaming-new-snow-panorama-halfsize.jpg"></FeedPost>
    <FeedPost image="https://jillsbooks.files.wordpress.com/2011/02/abraham-lincoln-was-very-tall.jpg" text="This is my first post!"></FeedPost>
  </div>)
}

export default HomePageSignedIn;