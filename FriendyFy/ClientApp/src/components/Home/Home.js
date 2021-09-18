import React, { Component } from 'react';
import FeedEvent from '../FeedEvent/FeedEvent';
import './Home.css';
import FeedPhoto from '../FeedPhoto/FeedPhoto';
export class Home extends Component {
  static displayName = Home.name;

  render() {
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
    return (
        <div className="feed">
          {events.map(event => <FeedEvent event={event} />)}
          <FeedPhoto image="https://tinyurl.com/44t28uud"></FeedPhoto>
          <FeedPhoto image="http://www.orneveien.org/nikon-d800/panoramas/huge/2015-02-06-wellville-mountains-gleaming-new-snow-panorama-halfsize.jpg"></FeedPhoto>
          <FeedPhoto image="https://jillsbooks.files.wordpress.com/2011/02/abraham-lincoln-was-very-tall.jpg"></FeedPhoto>
        </div>
    );
  }
}
